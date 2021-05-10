<template>
    <div v-if="show">
        <div class="modal fade updateRecordModal">
            <div class="modal-dialog loginModal">
                <div class="modal-content">
                    <div class="modal-header" style="text-align: center;">
                        <h2 class="modal-title" style="position: relative;left: 30%;color: yellowgreen;">更改學生進度</h2>
                        <button class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body loginBody">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">更改紀錄:</label>
                                <input type="text" class="form-control" id="inputRecordYear"  placeholder="請輸入年">
                                <input type="text" class="form-control" id="inputRecordMonth"  placeholder="請輸入月">
                                <input type="text" class="form-control" id="inputRecordGrade"  placeholder="請輸入年級">
                                <input type="text" class="form-control" id="inputRecordMath"  placeholder="請輸入數學進度">
                                <input type="text" class="form-control" id="inputRecordChinese"  placeholder="請輸入國語進度">
                                <input type="text" class="form-control" id="inputRecordEnglish"  placeholder="請輸入英文進度">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="changeOneRecord()">確認送出</button>
                    </div>
                </div>
            </div>
        </div>

        <h3>{{student.studentName}}</h3>
        <br>
        <div>
            <div v-if="student" style="display: inline;">
                <img class="lastPage" src="/img/arrow-left.jpeg" @click="preLast" height="50" width="50">
                <img class="nextPage" src="/img/arrow-right.jpg" @click="preNext" height="50" width="50" style="margin-left: 90%;">
            </div>
            <table class="table previewTable" style="margin-top: 3%;">
                <thead class="thead-light">
                <tr class="monthCol">
                    <th scope="col">科目</th>
                    <th scope="col" v-for="(progress, idx) in chosenStudentRecordPre" :key="idx">{{progress.year + '年' + progress.month + "月"}}</th>
                </tr>
                </thead>
                <tbody>
                <tr class="math">
                    <th scope="row">數學</th>
                    <td v-for="(progress, idx) in chosenStudentRecordPre" :key="idx">{{progress.progress.math}}</td>
                </tr>
                <tr class="mathI" style="background-color:#409FFF">
                    <th scope="row">數學(距I線)</th>
                    <td v-for="(progress, idx) in chosenStudentRecordPre" :key="idx">{{progress.progress.mathI}}</td>
                </tr>
                <tr class="chinese">
                    <th scope="row">國語</th>
                    <td v-for="(progress, idx) in chosenStudentRecordPre" :key="idx">{{progress.progress.chinese}}</td>
                </tr>
                <tr class="chineseI" style="background-color:#409FFF">
                    <th scope="row">國語(距I線)</th>
                    <td v-for="(progress, idx) in chosenStudentRecordPre" :key="idx">{{progress.progress.chineseI}}</td>
                </tr>
                <tr class="english">
                    <th scope="row">英文</th>
                    <td v-for="(progress, idx) in chosenStudentRecordPre" :key="idx">{{progress.progress.english}}</td>
                </tr>
                <tr class="englishI" style="background-color:#409FFF">
                    <th scope="row">英文(距I線)</th>
                    <td v-for="(progress, idx) in chosenStudentRecordPre" :key="idx">{{progress.progress.englishI}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <button v-if="this.$store.state.isTeacher" class="btn btn-success" data-toggle="modal" data-target=".updateRecordModal" style="margin-left: 10px">更改學生進度</button>
    </div>
</template>
<script>
module.exports = {
    data: function(){
        return {
            chosenStudentRecordPre: null,
            chosenStudentRecordPreCurrent: null,
            studentRecord: null
        }
    },
    props: ["student", "show"],
    mounted: function() {
        let vm = this
        $.ajax({
            type: "GET",
            url: "/report/" + this.student.studentId,
            dataType: "json",
            headers : {
                "Authorization": Cookies.get("jwtToken")
            },
            success: function(response) {
                if(response.progress.length > 6) {
                    vm.chosenStudentRecordPre = response.progress.slice(response.progress.length - 6, response.progress.length);
                    vm.chosenStudentRecordPreCurrent = response.progress.length - 6;
                }
                else {
                    vm.chosenStudentRecordPre = response.progress
                    vm.chosenStudentRecordPreCurrent = 0;
                }
                vm.studentRecord = response;
            },
            error: function(err) {
                alert({err: err.message});
                return
            }
        });
    },
    watch: {
        student: function(newData) {
            let vm = this
            $.ajax({
                type: "GET",
                url: "/report/" + newData.studentId,
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                success: function(response) {
                    if(response.progress.length > 6) {
                        vm.chosenStudentRecordPre = response.progress.slice(response.progress.length - 6, response.progress.length);
                        vm.chosenStudentRecordPreCurrent = response.progress.length - 6;
                    }
                    else {
                        vm.chosenStudentRecordPre = response.progress
                        vm.chosenStudentRecordPreCurrent = 0;
                    }
                    vm.studentRecord = response;
                },
                error: function(err) {
                    alert({err: err.message});
                    return
                }
            });
        }
    },
    methods: {
        changeOneRecord() {
            let vm = this;
            $.ajax({
                type: "POST",
                url: "/report/progress/update",
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                data: {
                    studentId: this.student.studentId,
                    year: $('#inputRecordYear').val(),
                    month: $('#inputRecordMonth').val(),
                    grade: $('#inputRecordGrade').val(),
                    math: $('#inputRecordMath').val(),
                    chinese: $('#inputRecordChinese').val(),
                    english: $('#inputRecordEhglish').val(),
                },
                success: function() {
                    alert("更改成功");
                    $('#inputRecordYear').val("");
                    $('#inputRecordMonth').val("");
                    $('#inputRecordGrade').val("");
                    $('#inputRecordMath').val("");
                    $('#inputRecordChinese').val("");
                    $('#inputRecordEnglish').val("");
                    $('.updateRecordModal').modal('hide');
                    $.ajax({
                        type: "GET",
                        url: "/report/" + vm.student.studentId,
                        dataType: "json",
                        headers : {
                            "Authorization": Cookies.get("jwtToken")
                        },
                        success: function(response) {
                            if(response.progress.length > 6) {
                                vm.chosenStudentRecordPre = response.progress.slice(response.progress.length - 6, response.progress.length);
                                vm.chosenStudentRecordPreCurrent = response.progress.length - 6;
                            }
                            else {
                                vm.chosenStudentRecordPre = response.progress
                                vm.chosenStudentRecordPreCurrent = 0;
                            }
                            vm.studentRecord = response;
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

        preLast() {
            if(this.chosenStudentRecordPreCurrent < 6 && this.chosenStudentRecordPreCurrent > 0) {
                this.chosenStudentRecordPre = this.studentRecord.progress.slice(0, this.chosenStudentRecordPreCurrent);
                this.chosenStudentRecordPreCurrent = 0;
            }
            else if(this.chosenStudentRecordPreCurrent >= 6) {
                this.chosenStudentRecordPre = this.studentRecord.progress.slice(this.chosenStudentRecordPreCurrent - 6, this.chosenStudentRecordPreCurrent);
                this.chosenStudentRecordPreCurrent = this.chosenStudentRecordPreCurrent - 6;
            }
        },
        
        preNext() {
            if(this.chosenStudentRecordPreCurrent == 0) {
                const preLength = this.chosenStudentRecordPre.length
                this.chosenStudentRecordPre = this.studentRecord.progress.slice(preLength, this.chosenStudentRecordPre.length + 6);
                this.chosenStudentRecordPreCurrent = preLength;
            }
            else if(this.chosenStudentRecordPreCurrent + 6 < this.studentRecord.progress.length) {
                this.chosenStudentRecordPre = this.studentRecord.progress.slice(this.chosenStudentRecordPreCurrent + 6, this.chosenStudentRecordPreCurrent + 12);
                this.chosenStudentRecordPreCurrent = this.chosenStudentRecordPreCurrent + 6
            }
        },
    }
}
</script>