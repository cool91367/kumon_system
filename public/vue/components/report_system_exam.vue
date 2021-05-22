<template>
    <div id="body" v-if="show">
        <h3>{{student.studentName}}</h3>
        <button v-if="teacher" class="btn btn-primary" @click="showInput">匯入教檢資料</button>
        <br>
        <div v-if="inputExam">
            <div class="row" style="margin-top: 1%;">
                <div class="col">
                    <input type="text" class="form-control" v-model="inputYear" placeholder="年">
                </div>
                <div class="col">
                    <input type="text" class="form-control" v-model="inputMonth" placeholder="月">
                </div>
                <div class="col">
                    <input type="text" class="form-control" v-model="inputDay" placeholder="日">
                </div>
            </div>
            <div class="row">
                <input type="text" class="form-control" v-model="inputGrade" placeholder="學年" style="margin-left: 2%; margin-right: 2%;margin-top: 1%;">
            </div>
            <div class="row">
                <input type="text" class="form-control" v-model="inputProgress" placeholder="教材別" style="margin-left: 2%; margin-right: 2%;margin-top: 1%;">
            </div>
            <div class="row">
                <input type="text" class="form-control" v-model="inputSubject" placeholder="科目" style="margin-left: 2%; margin-right: 2%;margin-top: 1%;">
            </div>
            <div class="row">
                <input type="text" class="form-control" v-model="inputTime" placeholder="時間" style="margin-left: 2%; margin-right: 2%;margin-top: 1%;">
            </div>
            <div class="row">
                <input type="text" class="form-control" v-model="inputScore" placeholder="分數" style="margin-left: 2%; margin-right: 2%;margin-top: 1%;">
            </div>
            <button class="btn btn-primary" @click="store" style="margin-top: 1%;">送出</button>
            <button class="btn btn-danger" @click="deleteExam" style="margin-top: 1%;">刪除</button>
        </div>

        <div v-if="examHistory">
            <table class="table" style="margin-top: 3%;">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">年/月/日</th>
                        <th scope="col">學年</th>
                        <th scope="col">科目</th>
                        <th scope="col">教材別</th>
                        <th scope="col">時間</th>
                        <th scope="col">答題率</th>
                    </tr>
                </thead>
                <tbody v-for="(history, idx) in examHistory" :key="idx">
                    <tr v-if="history.subject == displaySubject">
                        <th scope="row">{{history.year + '/' + history.month + '/' + history.day}}</th>
                        <th >{{history.grade}}</th>
                        <th  scope="row">{{history.subject}}</th>
                        <th>{{history.progress}}</th>
                        <th>{{history.time}}</th>
                        <th>{{history.score}}</th>
                    </tr>
                </tbody>
            </table>
            <button type="button" class="btn btn-light" @click="showSubject('數學')">數學</button>
            <button type="button" class="btn btn-light" @click="showSubject('國語')">國語</button>
            <button type="button" class="btn btn-light" @click="showSubject('英文')">英文</button>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return {
            inputExam: false,
            examHistory: false,
            inputYear: "",
            inputMonth: "",
            inputDay: "",
            inputGrade: "",
            inputProgress: "",
            inputSubject: "",
            inputTime: "",
            inputScore: "",
            displaySubject: "數學"
        }
    },
    props: ["student", "show", "teacher"],
    mounted: function() {
        let vm = this;
        $.ajax({
            type: "GET",
            url: "/report/examHistory/" + vm.student.studentId,
            dataType: "json",
            headers : {
                "Authorization": Cookies.get("jwtToken")
            },
            success: function(response) {
                vm.inputExam = false;
                vm.examHistory = response.examRecord;
                if(vm.examHistory) {
                    vm.displayPage = vm.examHistory.length-1;
                }
                else {
                    vm.displayPage = null;
                }
            },
            error: function(err) {
                alert({err: err.message});
                return
            }
        });
    },
    watch: {
        student: async function(newData) {
            let vm = this;
            $.ajax({
                type: "GET",
                url: "/report/examHistory/" + newData.studentId,
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                success: function(response) {
                    vm.inputExam = false;
                    vm.examHistory = response.examRecord;
                    if(vm.examHistory) {
                        vm.displayPage = vm.examHistory.length-1;
                    }
                    else {
                        vm.displayPage = null;
                    }
                },
                error: function(err) {
                    alert({err: err.message});
                    return
                }
            });
        }
    },
    methods: {
        showSubject(subject) {
            this.displaySubject = subject;
        },

        showInput() {
            this.inputExam = true;
        },

        store() {
            let vm = this;
            $.ajax({
                type: "POST",
                url: "/report/exam/update",
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                data: {
                    studentId: vm.student.studentId, 
                    year: vm.inputYear,
                    month: vm.inputMonth,
                    day: vm.inputDay,
                    examGrade: vm.inputGrade, 
                    examProgress: vm.inputProgress, 
                    examSubject: vm.inputSubject, 
                    examTime: vm.inputTime, 
                    examScore: vm.inputScore
                },
                success: function(response) {
                    alert("儲存成功");
                    vm.inputYear = "";
                    vm.inputMonth = "";
                    vm.inputDay = "";
                    vm.inputGrade = "";
                    vm.inputProgress = "";
                    vm.inputSubject = "";
                    vm.inputTime = "";
                    vm.inputScore = "";
                    vm.inputExam = false
                    $.ajax({
                        type: "GET",
                        url: "/report/examHistory/" + vm.student.studentId,
                        dataType: "json",
                        headers : {
                            "Authorization": Cookies.get("jwtToken")
                        },
                        success: function(response) {
                            vm.examHistory = response.examRecord;
                            if(vm.examHistory) {
                                vm.displayPage = vm.examHistory.length-1;
                            }
                            else {
                                vm.displayPage = null;
                            }
                        },
                        error: function(err) {
                            alert({err: err.message});
                            return
                        }
                    });
                },
                error: function(err) {
                    alert({err: err.message});
                    return
                }
            });
        },

        deleteExam() {
            let vm = this;
            $.ajax({
                type: "POST",
                url: "/report/examHistory/delete",
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                data: {
                    studentId: vm.student.studentId, 
                    year: vm.inputYear,
                    month: vm.inputMonth,
                    day: vm.inputDay,
                    subject: vm.inputSubject, 
                },
                success: function(response) {
                    alert("刪除成功");
                    vm.inputYear = "";
                    vm.inputMonth = "";
                    vm.inputDay = "";
                    vm.inputGrade = "";
                    vm.inputProgress = "";
                    vm.inputSubject = "";
                    vm.inputTime = "";
                    vm.inputScore = "";
                    vm.inputExam = false
                    $.ajax({
                        type: "GET",
                        url: "/report/examHistory/" + vm.student.studentId,
                        dataType: "json",
                        headers : {
                            "Authorization": Cookies.get("jwtToken")
                        },
                        success: function(response) {
                            vm.examHistory = response.examRecord;
                            if(vm.examHistory) {
                                vm.displayPage = vm.examHistory.length-1;
                            }
                            else {
                                vm.displayPage = null;
                            }
                        },
                        error: function(err) {
                            alert({err: err.message});
                            return
                        }
                    });
                },
                error: function(err) {
                    alert({err: err.message});
                    return
                }
            });
        }
    }
}