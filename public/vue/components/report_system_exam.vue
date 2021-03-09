<template>
    <div id="body" v-if="show">
        <h3>{{student.studentName}}</h3>
        <button v-if="teacher" class="btn btn-primary" @click="showInput">匯入教檢資料</button>
        <br>
        <div v-if="inputExam">
            <form>
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
            </form>
        </div>

        <div v-if="examHistory">
            <table class="table" style="margin-top: 3%;">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">年/月/日</th>
                        <th scope="col">目前學年</th>
                        <th scope="col">目前教材</th>
                        <th scope="col">科目</th>
                        <th scope="col">時間</th>
                        <th scope="col">正確率</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">{{examHistory[displayPage].year + '/' + examHistory[displayPage].month + '/' + examHistory[displayPage].day}}</th>
                        <th id = "grade">{{examHistory[displayPage].grade}}</th>
                        <th id = "math">{{examHistory[displayPage].progress}}</th>
                        <th id = "ILine" scope="row">{{examHistory[displayPage].subject}}</th>
                        <th id = "mathI">{{examHistory[displayPage].time}}</th>
                        <th id = "mathI">{{examHistory[displayPage].score}}</th>
                    </tr>
                </tbody>
            </table>
            <div class="analyzeArrowArea" style="display: inline;">
                <img class="analyzeLastPage" src="/img/arrow-left.jpeg" @click="lastPage" height="50" width="50">
                <img class="analyzeNextPage" src="/img/arrow-right.jpg" @click="nextPage" height="50" width="50" style="margin-left: 90%;">
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return {
            inputExam: false,
            examHistory: false,
            displayPage: null,
            inputYear: "",
            inputMonth: "",
            inputDay: "",
            inputGrade: "",
            inputProgress: "",
            inputSubject: "",
            inputTime: "",
            inputScore: ""
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
        lastPage() {
            if(this.displayPage == 0) {
                return
            }
            this.displayPage--;
        },

        nextPage() {
            if(this.displayPage >= this.examHistory.length-1) {
                return
            }
            this.displayPage++;
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
        }
    }
}