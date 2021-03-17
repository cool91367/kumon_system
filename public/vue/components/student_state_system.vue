<template>
    <div class="container-fluid" style="height: 94%;">
        <div class="row" style="height: 100%;">
            <div v-if="$store.state.isTeacher" class="col-2 studentList" style="background-color: #ABDCFF;height: 100%; overflow: auto;position: relative;" >
                <br>
                <button class="btn btn-primary" @click="showInputNewStudent()">新入會</button>
                <ul v-for="(student, idx) in $store.state.userInfo.studentList" :key="idx">
                    <li class="studentConnect" style="display: inline;" :id="student.studentId"  @click="getStudentInfo($event)"><a>{{ student.studentName }}</a></li>
                </ul>
            </div>

            <div class="bodyArea" :class="{ 'col-10': $store.state.isTeacher, 'col-12': !$store.state.isTeacher }" style="height: 100%;">
                <div class="container-fluid" style="margin-top:1%; border: solid 2px; border-radius: 10px;height: 85%;overflow: auto;
                background-image:url(img/background.jpg);background-repeat: no-repeat;background-position: center;">
                    <!--進度一覽表-->
                    <div v-if="chosenStudent">
                        <h3>{{chosenStudent.name}}</h3>
                        <br>
                        <br>
                        <h4>入會狀態: {{chosenStudent.enrollState}}</h4>
                        <br>
                        <h4>學生帳號: {{chosenStudent.id}}</h4>
                        <br>
                        <h4>入會學年: {{chosenStudent.grade}}</h4>
                        <br>
                        <h4>未回覆訊息: {{chosenStudent.unReadMessage}}</h4>
                        <br><br>
                        <button class="btn btn-danger" @click="unenroll()">退會</button>
                        <button class="btn btn-secondary" @click="reenroll()">復會</button>
                    </div>

                    <div v-if="inputNewStudent">
                        <form>
                            <div class="form-group">
                                <label for="學生姓名">學生姓名:</label>
                                <input type="text" class="form-control"  id="inputStudentName" placeholder="輸入學生姓名">
                            </div>
                            <div class="form-group">
                                <label for="家長電話">家長電話:</label>
                                <input type="text" class="form-control"  id="inputParentsPhone" placeholder="輸入家長電話">
                            </div>
                            <div class="form-group row">
                                <div class="col-4">
                                    <label for="入會年分">入會年分:</label>
                                    <input type="text" class="form-control"  id="inputStudentEnrollYear" placeholder="輸入學生入會年分">
                                </div>
                                <div class="col-4">
                                    <label for="入會月分">入會月分:</label>
                                    <input type="text" class="form-control"  id="inputStudentEnrollMonth" placeholder="輸入學生入會月分">
                                </div>
                                <div class="col-4">
                                    <label for="入會月分">入會日:</label>
                                    <input type="text" class="form-control"  id="inputStudentEnrollDay" placeholder="輸入學生入會月分">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="入會年級">入會學年:</label>
                                <input type="text" class="form-control"  id="inputStudentGrade" placeholder="輸入學生入會學年">
                            </div>
                            <div class="form-group row">
                                <div class="col-6">
                                    <label for="上課日">上課日一:</label>
                                    <input type="text" class="form-control col"  id="inputClassDay1" placeholder="輸入學生上課日一">
                                </div>
                                <div class="col-6">
                                    <label for="上課日">上課日二:</label>
                                    <input type="text" class="form-control col"  id="inputClassDay2" placeholder="輸入學生上課日二">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="家長的LineID">家長的LineID:</label>
                                <input type="text" class="form-control"  id="inputParentsLineID" placeholder="輸入學生家長的LineID">
                            </div>
                            <div class="form-group">
                                <label for="備註">備註:</label>
                                <input type="text" class="form-control"  id="inputStudentNote" placeholder="輸入學生備註">
                            </div>
                            <button @click="addStudent" class="btn btn-primary">確定入會</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data: function(){
            return {
                inputNewStudent: false,
                chosenStudent: false
            }
        },
        methods: {

            async getStudentInfo(event) {
                this.inputNewStudent = false;
                const studentId = event.currentTarget.id;
                const studentList = this.$store.state.userInfo.studentList
                for(const studentInfo in studentList) {
                    if( studentList[studentInfo].studentId == studentId) {
                        let enrollState = null;
                        if(studentList[studentInfo].enrollState == 1) {
                            enrollState = "入會";
                        }
                        else if(studentList[studentInfo].enrollState == 0) {
                            enrollState = "未入會";
                        }
                        else if(studentList[studentInfo].enrollState == 2) {
                            enrollState = "休會"
                        }

                        this.chosenStudent = {
                            id: studentList[studentInfo].studentId,
                            name: studentList[studentInfo].studentName,
                            grade: studentList[studentInfo].studentGrade,
                            enrollState: enrollState,
                            unReadMessage: studentList[studentInfo].unReadMessage
                        }
                        return
                    }
                }
            },

            async reenroll() {
                let vm = this;

                await $.ajax({
                    type: "POST",
                    url: "/user/student/enroll_state/update",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        teacherAccount: this.$store.state.userInfo.account,
                        studentId: this.chosenStudent.id,
                        updateState: 1
                    },
                    success: function() {
                        alert("復會成功");
                        vm.chosenStudent.enrollState = "入會"
                    },
                    error: function(err) {
                        alert(err);
                        return
                    }
                });

                
                await $.ajax({
                    type: "GET",
                    url: "/user/" + this.$store.state.userInfo.account + "/studentList",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.$store.state.userInfo.studentList = response.studentList;
                        vm.inputNewStudent = false;
                    },
                    error: function(err) {
                        alert(err);
                        return
                    }
                });
            },

            async unenroll() {
                let vm = this;

                await $.ajax({
                    type: "POST",
                    url: "/user/student/enroll_state/update",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        teacherAccount: this.$store.state.userInfo.account,
                        studentId: this.chosenStudent.id,
                        updateState: 2
                    },
                    success: function() {
                        alert("休會成功");
                        vm.chosenStudent.enrollState = "休會"
                    },
                    error: function(err) {
                        alert(err);
                        return
                    }
                });

                
                await $.ajax({
                    type: "GET",
                    url: "/user/" + this.$store.state.userInfo.account + "/studentList",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.$store.state.userInfo.studentList = response.studentList;
                        vm.inputNewStudent = false;
                    },
                    error: function(err) {
                        alert(err);
                        return
                    }
                });
            },

            async addStudent() {
                let vm = this;
                await $.ajax({
                    type: "POST",
                    url: "/user/student/new",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        studentName: $('#inputStudentName').val(),
                        parentsPhone: $('#inputParentsPhone').val(),
                        enrollYear: $('#inputStudentEnrollYear').val(),
                        enrollMonth: $('#inputStudentEnrollMonth').val(),
                        enrollDay: $('#inputStudentEnrollDay').val(),
                        enrollGrade: $('#inputStudentGrade').val(),
                        parentsLineID: $('#inputParentsLineID').val(),
                        note: $('#inputStudentNote').val(),
                        teacherAccount: this.$store.state.userInfo.account,
                        classDay1: $('#inputClassDay1').val(),
                        classDay2: $('#inputClassDay2').val()
                    },
                    success: function() {
                        alert("入會成功");
                        $('#inputStudentName').val("");
                        $('#inputParentsPhone').val("");
                        $('#inputStudentEnrollYear').val("");
                        $('#inputStudentEnrollMonth').val("");
                        $('#inputStudentEnrollDay').val("");
                        $('#inputStudentGrade').val("");
                        $('#inputParentsLineID').val("");
                        $('#inputStudentNote').val("");
                        $('#inputClassDay1').val("");
                        $('#inputClassDay2').val("");
                    },
                    error: function(err) {
                        alert(err);
                        return
                    }
                });

                await $.ajax({
                    type: "GET",
                    url: "/user/" + this.$store.state.userInfo.account + "/studentList",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.$store.state.userInfo.studentList = response.studentList;
                        vm.inputNewStudent = false;
                    },
                    error: function(err) {
                        alert(err);
                        return
                    }
                });
            },

            showInputNewStudent() {
                this.chosenStudent = false;
                this.inputNewStudent = true;
            }

        }
    }
</script>

<style scoped>
    .main-body{
        margin-top: 5%;
    }
</style>