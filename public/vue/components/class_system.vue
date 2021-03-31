<template>
    <div class="container-fluid" style="height: 94%;">
        <div class="modal fade makeUp">
            <div class="modal-dialog loginModal">
                <div class="modal-content">
                    <div class="modal-header" style="text-align: center;">
                        <h2 class="modal-title" style="position: relative;left: 41%;color: yellowgreen;">補打卡</h2>
                        <button class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body loginBody">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">應該上課日:</label>
                                <input type="text" class="form-control" id="inputMakeUpYear"  placeholder="請輸入應該上課年">
                                <input type="text" class="form-control" id="inputMakeUpMonth"  placeholder="請輸入應該上課月">
                                <input type="text" class="form-control" id="inputMakeUpDay"  placeholder="請輸入應該上課日">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="makeUp()">確認送出</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade dayOff">
            <div class="modal-dialog loginModal">
                <div class="modal-content">
                    <div class="modal-header" style="text-align: center;">
                        <h2 class="modal-title" style="position: relative;left: 41%;color: yellowgreen;">請假單</h2>
                        <button class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body loginBody">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputPassword1">請假日期:</label>
                                <input type="text" class="form-control" id="InputDayOffYear" placeholder="請輸入請假日期(年)">
                                <input type="text" class="form-control" id="InputDayOffMonth" placeholder="請輸入請假日期(月)">
                                <input type="text" class="form-control" id="InputDayOffDay" placeholder="請輸入請假日期(日)">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">請假原因或是補課日期說明:</label>
                                <input type="text" class="form-control" id="InputDayOffReason" placeholder="請輸入請假說明">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="dayOff()">確認送出</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 取消打卡的model -->
        <div class="modal fade deleteCheckInModal">
            <div class="modal-dialog loginModal">
                <div class="modal-content">
                    <div class="modal-header" style="text-align: center;">
                        <h2 class="modal-title" style="position: relative;left: 41%;color: yellowgreen;">取消打卡</h2>
                        <button class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">取消打卡日:</label>
                                <input type="text" class="form-control" id="deleteCheckInYear"  placeholder="請輸入取消打卡年">
                                <input type="text" class="form-control" id="deleteCheckInMonth"  placeholder="請輸入取消打卡月">
                                <input type="text" class="form-control" id="deleteCheckInDay"  placeholder="請輸入取消打卡日">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="deleteCheckIn()">確認送出</button>
                    </div>
                </div>
            </div>
        </div>


        <div class="row" style="height: 100%;">
            <div v-if="$store.state.isTeacher" class="col-2 studentList" style="background-color: #ABDCFF;height: 100%; overflow: auto;position: relative;" >
                <br>
                <ul v-for="(student, idx) in $store.state.userInfo.studentList" :key="idx">
                    <li v-if="student.enrollState == 1" class="studentConnect" style="display: inline;" :id="student.studentId"  @click="getStudentInfo($event)"><a>{{ student.studentName }}</a></li>
                </ul>
            </div>

            <div class="bodyArea" :class="{ 'col-10': $store.state.isTeacher, 'col-12': !$store.state.isTeacher }" style="height: 100%;">
                <div class="container-fluid" style="margin-top:1%; border: solid 2px; border-radius: 10px;height: 85%;overflow: auto;
                background-image:url(img/background.jpg);background-repeat: no-repeat;background-position: center;">
                    <h3>{{chosenStudent.name}}</h3>
                    <br>
                    <div class="row">
                        <div class="calendar col-8">
                            <div class="title" style="position: relative;">
                                <h1 class="green" id="calendar-title">Month</h1>
                                <h2 class="green small" id="calendar-year">Year</h2>
                                <a href="" id="prev">上個月</a>
                                <a href="" id="next" style="position: absolute;right: 0;">下個月</a>
                            </div>
                            <div class="body">
                                <div class="lightgrey body-list">
                                    <ul>
                                        <li>MON</li>
                                        <li>TUE</li>
                                        <li>WED</li>
                                        <li>THU</li>
                                        <li>FRI</li>
                                        <li>SAT</li>
                                        <li>SUN</li>
                                    </ul>
                                </div>
                                <div class="darkgrey body-list">
                                    <ul id="days">
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="col-4">
                            <div>
                                <h3>打卡資訊</h3>
                                <div v-for="(checkIn, idx) in checkInInfo" :key="idx">
                                    <p v-if="!checkIn.makeUp">{{checkIn.actualDay + '號'}}到班時間: {{checkIn.time}}</p>
                                    <p v-if="checkIn.makeUp">補課: {{checkIn.makeUpDay}} 補 {{checkIn.actualDay + '號'}} 的課</p>
                                </div>
                            </div>

                            <div>
                                <h3>請假資訊</h3>
                                <div v-for="(dayOff, idx) in dayOffInfo" :key="idx">
                                    <p>{{dayOff.day}} 號請假  note:{{dayOff.text}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary" @click="checkIn">打卡上課</button>
                    <button class="btn btn-success" data-toggle="modal" data-target=".makeUp" style="margin-left: 10px">補打卡</button>
                    <button class="btn btn-danger" data-toggle="modal" data-target=".dayOff" style="margin-left: 10px">請假</button>
                    <button class="btn btn-danger" data-toggle="modal" data-target=".deleteCheckInModal" style="margin-left: 10px">取消打卡</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
    var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
    var month_name = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
    var my_date = new Date();
    var my_year = my_date.getFullYear();
    var my_month = my_date.getMonth();
    var my_day = my_date.getDate();

    var holder;
    var prev;
    var next;
    var ctitle;
    var cyear;
    module.exports = {
        data: function(){
            return {
                inputNewStudent: false,
                chosenStudent: false,
                classDay1: null,
                classDay2: null,
                checkInInfo: [],
                dayOffInfo: [],
            }
        },
        mounted: function() {
            let vm = this;
            holder = document.getElementById("days");
            prev = document.getElementById("prev");
            next = document.getElementById("next");
            ctitle = document.getElementById("calendar-title");
            cyear = document.getElementById("calendar-year");
            refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
            prev.onclick = async function(e){
                e.preventDefault();
                my_month--;
                if(my_month<0){
                    my_year--;
                    my_month = 11;
                }
                await $.ajax({
                    type: "GET",
                    url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/checkIn",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.checkInInfo = response;
                        refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });

                await $.ajax({
                    type: "GET",
                    url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/dayOff",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.dayOffInfo = response;
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });
                refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
            }
            next.onclick = async function(e){
                e.preventDefault();
                my_month++;
                if(my_month>11){
                    my_year++;
                    my_month = 0;
                }
                await $.ajax({
                    type: "GET",
                    url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/checkIn",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.checkInInfo = response;
                        refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });

                await $.ajax({
                    type: "GET",
                    url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/dayOff",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.dayOffInfo = response;
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });
                refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
            }
        },
        methods: {
            dayOff() {
                let vm = this;

                // 同時兼容西元年及民國年
                let dayOffYear = $('#InputDayOffYear').val();
                dayOffYear = parseInt(dayOffYear);
                dayOffYear = dayOffYear < 1000? dayOffYear + 1911 : dayOffYear;

                $.ajax({
                    type: "POST",
                    url: "/class/dayOff/update",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        studentId: vm.chosenStudent.id, 
                        year: dayOffYear.toString(), 
                        month: $('#InputDayOffMonth').val(), 
                        day: $('#InputDayOffDay').val(), 
                        reason: $('#InputDayOffReason').val()
                    },
                    success: function(response) {
                        alert("請假成功");
                        $.ajax({
                            type: "GET",
                            url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/dayOff",
                            dataType: "json",
                            headers : {
                                "Authorization": Cookies.get("jwtToken")
                            },
                            success: function(response) {
                                $('#InputDayOffYear').val("");
                                $('#InputDayOffMonth').val("");
                                $('#InputDayOffDay').val("");
                                $('#InputDayOffReason').val("");
                                $('.dayOff').modal('hide');
                                vm.dayOffInfo = response;
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

            async checkIn() {
                let vm = this;
                const my_date = new Date();
                $.ajax({
                    type: "POST",
                    url: "/class/checkIn/update",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        studentId: vm.chosenStudent.id, 
                        year: my_date.getFullYear(), 
                        month: my_date.getMonth() + 1, 
                        day: my_date.getDate(), 
                        time: my_date.getHours().toString() + ":" + my_date.getMinutes().toString()
                    },
                    success: function(response) {
                        alert("打卡成功");
                        $.ajax({
                            type: "GET",
                            url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/checkIn",
                            dataType: "json",
                            headers : {
                                "Authorization": Cookies.get("jwtToken")
                            },
                            success: function(response) {
                                vm.checkInInfo = response;
                                refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
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

            async deleteCheckIn() {
                let vm = this;
                const my_date = new Date();
                // 同時兼容西元年及民國年
                let deleteCheckInYear = $('#deleteCheckInYear').val();
                deleteCheckInYear = parseInt(deleteCheckInYear);
                deleteCheckInYear = deleteCheckInYear < 1000? deleteCheckInYear + 1911 : deleteCheckInYear;

                $.ajax({
                    type: "POST",
                    url: "/class/checkIn/delete",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        studentId: vm.chosenStudent.id, 
                        year: deleteCheckInYear.toString(), 
                        month: $('#deleteCheckInMonth').val(), 
                        day: $('#deleteCheckInDay').val(), 
                    },
                    success: function(response) {
                        alert("取消打卡成功");
                        $('#deleteCheckInYear').val("");
                        $('#deleteCheckInMonth').val("");
                        $('#deleteCheckInDay').val("");
                        $.ajax({
                            type: "GET",
                            url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/checkIn",
                            dataType: "json",
                            headers : {
                                "Authorization": Cookies.get("jwtToken")
                            },
                            success: function(response) {
                                vm.checkInInfo = response;
                                refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
                            },
                            error: function(err) {
                                alert({err: err.message});
                                return
                            }
                        });
                        $('.deleteCheckInModal').modal('hide');
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });
            },

            async getStudentInfo(event) {
                let vm = this;
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
                        break;
                    }
                }
                await $.ajax({
                    type: "GET",
                    url: "/class/" + vm.chosenStudent.id + "/classDay",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.classDay1 = response.classDay1;
                        vm.classDay2 = response.classDay2;
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });

                await $.ajax({
                    type: "GET",
                    url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/checkIn",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    success: function(response) {
                        vm.checkInInfo = response;
                        refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });

                await $.ajax({
                    type: "GET",
                    url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/dayOff",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    error: function(err) {
                        console.log(err);
                        alert({err: err})
                    },
                    success: function(response) {
                        vm.dayOffInfo = response;
                    }
                });
            },
            
            showInputNewStudent() {
                this.chosenStudent = false;
                this.inputNewStudent = true;
            },

            makeUp() {
                let vm = this;
                const my_date = new Date();
                // 同時兼容西元年及民國年
                let makeUpYear = $('#inputMakeUpYear').val();
                makeUpYear = parseInt(makeUpYear);
                makeUpYear = makeUpYear < 1000? makeUpYear + 1911 : makeUpYear;

                $.ajax({
                    type: "POST",
                    url: "/class/makeUp/update",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        studentId: vm.chosenStudent.id, 
                        year: makeUpYear.toString(), 
                        month: $('#inputMakeUpMonth').val(), 
                        actualDay: $('#inputMakeUpDay').val(),
                        makeUpDay:  my_date.getFullYear().toString() + '/' + (my_date.getMonth() + 1).toString() + '/' +  my_date.getDate().toString(),
                        time: my_date.getHours().toString() + ":" + my_date.getMinutes().toString()
                    },
                    success: function(response) {
                        alert("打卡成功");
                        $('#inputMakeUpDay').val("");
                        $('#inputMakeUpMonth').val("");
                        $('#inputMakeUpYear').val("");
                        $('.makeUp').modal('hide');
                        $.ajax({
                            type: "GET",
                            url: "/class/" + vm.chosenStudent.id + "/" + my_year + "/" + (my_month + 1) + "/checkIn",
                            dataType: "json",
                            headers : {
                                "Authorization": Cookies.get("jwtToken")
                            },
                            success: function(response) {
                                vm.checkInInfo = response;
                                refreshDate(vm.classDay1, vm.classDay2, vm.checkInInfo);
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

    function checked(day, checkInArr) {
        for(let i = 0;i < checkInArr.length; i++) {
            if(checkInArr[i].actualDay == day){
                return true
            }
        }
        return false
    }

    function refreshDate(day1, day2, checkInArr){
                var str = "";
                var totalDay = daysMonth(my_month, my_year); //获取该月总天数
                var firstDay = dayStart(my_month, my_year); //获取该月第一天是星期几
                let weekDay = firstDay;
                let classCount = 0;
                var myclass;
                for(var i=1; i<firstDay; i++){ 
                    str += "<li></li>"; //为起始日之前的日期创建空白节点
                }
                for(var i=1; i<=totalDay; i++){
                    if(checked(i, checkInArr)) {
                        myclass = " class='green greenbox'";
                        classCount++;
                    }
                    else if (weekDay == day1 || weekDay == day2){
                        if(classCount < 8){
                            myclass = " class='red redbox'";//應該上課日
                            classCount++;
                        }
                    }else{
                        myclass = " class='darkgrey'"; //当该日期在今天之后时，以深灰字体显示
                    }
                    
                    if(checked(i, checkInArr)) {
                        // 加上時間
                        for(let j = 0;j < checkInArr.length;j++) {
                            if(checkInArr[j].actualDay == i) {
                                if(checkInArr[j].makeUp) {
                                    str += "<li"+" style='border:1px solid #F28500;color: #996B1F; background: #FFD700'>"+ i + "</li>"; //创建日期节点
                                }
                                else {
                                    str += "<li"+myclass+">"+ i +"</li>"; //创建日期节点
                                }
                                break;
                            }
                        }
                    }
                    else{
                        str += "<li"+myclass+">"+i +"</li>"; //创建日期节点
                    }

                    weekDay++;
                    if(weekDay == 8) {
                        weekDay = 1;
                    }
                }
                holder.innerHTML = str; //设置日期显示
                ctitle.innerHTML = month_name[my_month]; //设置英文月份显示
                cyear.innerHTML = my_year; //设置年份显示
            }
    //获取某年某月第一天是星期几
    function dayStart(month, year) {
        var tmpDate = new Date(year, month, 1);
        return (tmpDate.getDay());
    }

    //计算某年是不是闰年，通过求年份除以4的余数即可
    function daysMonth(month, year) {
        var tmp = year % 4;
        if (tmp == 0) {
            return (month_olympic[month]);
        } else {
            return (month_normal[month]);
        }
    }
</script>

<style scoped>
    .main-body{
        margin-top: 5%;
    }
    .calendar{
        width:8000px;
        height:400px;
        background:#fff;
        box-shadow:0px 1px 1px rgba(0,0,0,0.1);
    }
    .body-list ul{
        width:100%;
        font-family:arial;
        font-weight:bold;
        font-size:14px;
    }
    .body-list ul li{
        width:14.28%;
        height:36px;
        line-height:36px;
        list-style-type:none;
        display:block;
        box-sizing:border-box;
        float:left;
        text-align:center;
    }

    .lightgrey{
        color:#a8a8a8; /*浅灰色*/
    }
    .darkgrey{
        color:#565656; /*深灰色*/
    }
    .green{
        color:#6ac13c; /*绿色*/
    }
    .greenbox{
        border:1px solid #6ac13c;
        background:#e9f8df; /*浅绿色背景*/
    }
    .red{
        color:red
    }
    .redbox{
        border:1px solid #d32818;
        /* background:#ac8174; 浅紅色背景 */
    }
</style>