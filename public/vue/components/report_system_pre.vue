<template>
    <div v-if="show">
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