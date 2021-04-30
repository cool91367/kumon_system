<template>
    <!--學習報告系統-->
    <div class="container-fluid 學習報告系統區域" style="height: 94%;">
        <div class="row" style="height: 100%;">
            <div v-if="$store.state.isTeacher" class="col-2 studentList" style="background-color: #ABDCFF;height: 100%; overflow: auto;position: relative;" >
                <br>
                <button class="btn btn-primary" @click="showInputNewRecord()">匯入新資料</button>
                <ul v-for="(student, idx) in $store.state.userInfo.studentList" :key="idx">
                    <li v-if="student.enrollState==1" class="studentConnect" style="display: inline;" @click="getStudentInfo(student)"><a>{{ student.studentName }}</a></li>
                </ul>
            </div>

            <div class="bodyArea" :class="{ 'col-10': $store.state.isTeacher, 'col-12': !$store.state.isTeacher }" style="height: 100%;">
                <div class="container-fluid" style="margin-top:1%; border: solid 2px; border-radius: 10px;height: 85%;overflow: auto;
                background-image:url(img/background.jpg);background-repeat: no-repeat;background-position: center;">
                    <!--進度一覽表-->
                    <div v-if="chosenStudent">
                        <report-system-pre :student="chosenStudent" :show="showPre"></report-system-pre>
                        <report-system-analyze :student="chosenStudent" :show="showAnalyze" :teacher="$store.state.isTeacher"></report-system-analyze>
                        <report-system-iline :student="chosenStudent" :show="showILine"></report-system-iline>
                        <report-system-exam :student="chosenStudent" :show="showExam" :teacher="$store.state.isTeacher"></report-system-exam>
                    </div>

                    <div v-if="inputNewRecord">
                        <button class="btn btn-primary" @click="submitProgress()">確定送出</button>
                        <label class="btn btn-info">
                            <input id="uploadProgressFile" style="display:none;" accept="xls/xlsx" @change="excelInput" type="file">
                            使用excel輸入
                        </label>
                        <div style="margin-bottom: 20px;">
                            <h4>請輸入年份及月分:</h4>
                            <div class="row">
                                <div class="col">
                                    <input type="text" class="form-control" id="inputYear" placeholder="年份">
                                </div>
                                <div class="col">
                                    <input type="text" class="form-control" id="inputMonth" placeholder="月份">
                                </div>
                            </div>
                        </div>
                        <div v-for="(student, idx) in newRecord" :key="idx" style="margin-bottom: 20px;">
                            <form v-if="student.enrollState == 1">
                                <div class="row">
                                    <div class="col-2">
                                        <h4>{{student.studentName}}</h4>
                                    </div>
                                    <div class="col-3">
                                        <label for="學年">學年:</label>
                                        <input type="text" class="form-control" v-model="student.studentGrade" placeholder="學年">
                                    </div>
                                    <div class="offset-1 col-5">
                                        <div class="row">
                                            <label for="數學進度">數學進度:</label>
                                            <input type="text" class="form-control" v-model="student.mathProgress" placeholder="數學進度">
                                        </div>
                                        <div class="row">
                                            <label for="國語進度">國語進度:</label>
                                            <input type="text" class="form-control" v-model="student.chineseProgress" placeholder="國語進度">
                                        </div>
                                        <div class="row">
                                            <label for="英文進度">英文進度:</label>
                                            <input type="text" class="form-control" v-model="student.englishProgress" placeholder="英文進度">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div @click="showPreFunction" class="overview col-2">成績一覽表</div>
                        <div @click="showAnalyzeFunction" class="analyzed offset-1 col-2">分析表</div>
                        <div @click="showILineFunction" class="ILineFlot offset-1 col-2">I線圖</div>
                        <div @click="showExamFunction" class="testResult offset-1 col-2" style="color: white;background-color: #FF0000;">教檢</div>
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
                chosenStudent: false,
                chosenStudentRecordPre: null,
                chosenStudentRecordPreCurrent: null,
                inputNewRecord: false,
                newRecord: null,
                showPre: true,
                showAnalyze: false,
                showILine: false,
                showExam: false
            }
        },
        mounted: function() {
            if(!this.$store.state.isTeacher && this.$store.state.userInfo) {
                this.chosenStudent = this.$store.state.userInfo;
                this.chosenStudent.studentName = this.chosenStudent.name;
                this.chosenStudent.studentId = this.chosenStudent.account;
            }
        },
        methods: {
            showPreFunction() {
                this.showPre = true;
                this.showAnalyze = false;
                this.showILine = false;
                this.showExam = false;
            },

            showAnalyzeFunction() {
                this.showPre = false;
                this.showAnalyze = true;
                this.showILine = false;
                this.showExam = false;
            },

            showILineFunction() {
                this.showPre = false;
                this.showAnalyze = false;
                this.showILine = true;
                this.showExam = false;
            },

            showExamFunction() {
                this.showPre = false;
                this.showAnalyze = false;
                this.showILine = false;
                this.showExam = true;
            },

            preLast() {
                if(this.chosenStudentRecordPreCurrent < 6 && this.chosenStudentRecordPreCurrent > 0) {
                    this.chosenStudentRecordPre = this.chosenStudent.progress.slice(0, this.chosenStudentRecordPreCurrent);
                    this.chosenStudentRecordPreCurrent = 0;
                }
                else if(this.chosenStudentRecordPreCurrent >= 6) {
                    this.chosenStudentRecordPre = this.chosenStudent.progress.slice(this.chosenStudentRecordPreCurrent - 6, this.chosenStudentRecordPreCurrent);
                    this.chosenStudentRecordPreCurrent = this.chosenStudentRecordPreCurrent - 6;
                }
            },
            
            preNext() {
                if(this.chosenStudentRecordPreCurrent == 0) {
                    const preLength = this.chosenStudentRecordPre.length
                    this.chosenStudentRecordPre = this.chosenStudent.progress.slice(preLength, this.chosenStudentRecordPre.length + 6);
                    this.chosenStudentRecordPreCurrent = preLength;
                }
                else if(this.chosenStudentRecordPreCurrent + 6 < this.chosenStudent.progress.length) {
                    this.chosenStudentRecordPre = this.chosenStudent.progress.slice(this.chosenStudentRecordPreCurrent + 6, this.chosenStudentRecordPreCurrent + 12);
                    this.chosenStudentRecordPreCurrent = this.chosenStudentRecordPreCurrent + 6
                }
            },

            getStudentInfo(student) {
                this.inputNewRecord = false;
                let vm = this;
                vm.chosenStudent = student;
            },

            excelInput(ev) {
                // 要先隱藏在開啟  v-model in v-for 才會重新 render
                this.inputNewRecord = false;
                let vm = this;
                const progressFile = ev.target.files;
                const progressFileReader = new FileReader();
                progressFileReader.onload = function(event) {
                    try {
                            var data = event.target.result
                            var workbook = XLSX.read(data, {
                                type: 'binary'
                            }) // 以二進位制流方式讀取得到整份excel表格物件
                        } catch (e) {
                            alert(e);
                            console.log('檔案型別不正確');
                            return;
                        }
                    let row = 2;
                    let studentNameNum = 3;
                    let count = 0; // 用來計算是否換下一個學生了
                    let studentName = null;
                    let studentGrade = null;
                    let studentMath = null;
                    let studentChinese = null;
                    let studentEnglish = null;
                    const sheet = workbook.Sheets['進度統計表'];
                    try{
                        while(sheet['A'+studentNameNum.toString()]) {
                            if(count == 0) {
                                studentName = sheet['A' + studentNameNum.toString()].v;
                                studentGrade = sheet['B' + studentNameNum.toString()].v;
                                if(sheet['F' + (studentNameNum + count).toString()]) {
                                    studentMath = sheet['F' + (studentNameNum + count).toString()].v;
                                }
                                count++;
                            }
                            else if(count == 1) {
                                if(sheet['F' + (studentNameNum + count).toString()]) {
                                    studentEnglish = sheet['F' + (studentNameNum + count).toString()].v;
                                }
                                count++;
                            }
                            else if(count == 2) {
                                if(sheet['F' + (studentNameNum + count).toString()]) {
                                    studentChinese = sheet['F' + (studentNameNum + count).toString()].v;
                                }
                                studentNameNum += 3;
                                count = 0;
                                // 更新 newRecord
                                for (newRecord in vm.newRecord) {
                                    if (vm.newRecord[newRecord].studentName == studentName) {
                                        vm.newRecord[newRecord].studentGrade = studentGrade;
                                        vm.newRecord[newRecord].mathProgress = studentMath;
                                        vm.newRecord[newRecord].chineseProgress = studentChinese;
                                        vm.newRecord[newRecord].englishProgress = studentEnglish;
                                    }
                                }
                                studentMath = null;
                                studentChinese = null;
                                studentEnglish = null;
                            }
                        }
                    } catch(err) {
                        console.log(err);
                        alert("檔案資料有誤 請檢查檔案")
                    }
                    // 重新更新v-model
                    vm.inputNewRecord = true;
                }
                
                // 以二進位制方式開啟檔案
                progressFileReader.readAsBinaryString(progressFile[0]);
            },

            submitProgress() {
                let progresses = [];
                let vm = this;
                let notComplete = false;
                let notCompleteStudentString = "";
                for(record in this.newRecord) {
                    if(this.newRecord[record].enrollState == 2) {
                        continue;
                    }
                    // 檢查是否都有輸入到進度
                    if( !this.newRecord[record].mathProgress && !this.newRecord[record].chineseProgress && !this.newRecord[record].englishProgress && this.newRecord[record].enrollState == 1) {
                        notComplete = true;
                        notCompleteStudentString += this.newRecord[record].studentName + "(進度) ";
                        // alert(this.newRecord[record].studentName + "資料不完整")
                        // return
                    }
                    if (!this.newRecord[record].studentGrade) {
                        notComplete = true;
                        notCompleteStudentString += this.newRecord[record].studentName + "(學年) ";
                        // alert(this.newRecord[record].studentName + "資料不完整")
                        // return
                    }
                    if( $('#inputYear').val() == "" || $('#inputMonth').val() == "") {
                        alert("未輸入年月份")
                        return
                    }
                    const progress = {
                        grade: this.newRecord[record].studentGrade,
                        studentId: this.newRecord[record].studentId,
                        math: this.newRecord[record].mathProgress,
                        chinese: this.newRecord[record].chineseProgress,
                        english: this.newRecord[record].englishProgress,
                    }
                    // 休會的就不更新
                    if(this.newRecord[record].enrollState == 1) {
                        progresses.push(progress);
                    }
                }
                if(notComplete) {
                    alert(notCompleteStudentString + "資料不完整");
                    return
                }
                $.ajax({
                    type: "POST",
                    url: "/report/progress/new",
                    dataType: "json",
                    headers : {
                        "Authorization": Cookies.get("jwtToken")
                    },
                    data: {
                        year: $('#inputYear').val(),
                        month: $('#inputMonth').val(),
                        progresses: progresses
                    },
                    success: function() {
                        for(record in vm.newRecord) {
                            vm.newRecord[record].mathProgress = "";
                            vm.newRecord[record].chineseProgress = "";
                            vm.newRecord[record].englishProgress = "";
                        }
                        vm.inputNewRecord = false;
                        $('#inputYear').val("");
                        $('#inputMonth').val("");
                        alert("上傳成功!");
                    },
                    error: function(err) {
                        alert({err: err.message});
                        return
                    }
                });
            },

            showInputNewRecord() {
                // copy by value
                this.newRecord = JSON.parse ( JSON.stringify ( this.$store.state.userInfo.studentList) );
                this.chosenStudent = false;
                this.inputNewRecord = true;
            }
        }
    }
</script>