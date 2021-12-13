<template>
    <div v-if="show">
        <h3>{{student.studentName}}</h3>
        <br>
        <div style="margin-top:-1%;">
            <div v-if="teacher" class="analyzedInput" >
                    <div class="form-group mx-sm-3 mb-2">
                        <input type="text" class="form-control" placeholder="分析年份" v-model="inputYear" style="width: 10%;display: inline;">
                        <input type="text" class="form-control" placeholder="分析月份" v-model="inputMonth" style="width: 10%;display: inline;margin-left: 1%">
                    </div>
                    <button class="btn btn-primary  analyzeBtn" @click="analyze">分析</button>
                    <button class="btn btn-secondary analyzeStoreBtn" @click="store">儲存</button><br><br>
                    <h5>預測張數:</h5>
                    <div>
                        <input type="text" class="form-control" placeholder="預測月數" v-model="inputMonthNum" style="width: 30%; display: inline;">
                        <input type="text" class="form-control" placeholder="數學" v-model="inputMath" style="width: 30%; display: inline;">
                        <input type="text" class="form-control" placeholder="國語" v-model="inputChinese" style="width: 30%; display: inline;">
                        <input type="text" class="form-control" placeholder="英文" v-model="inputEnglish" style="width: 30%; display: inline;">
                    </div>
            </div>
            <div v-if="teacher" class="analyzedTable" style="border-bottom: black 3px dashed;">
                <table v-if="analyzeResult" class="table analyzeTable" style="margin-top: 3%;">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">年/月</th>
                            <th scope="col">學年</th>
                            <th scope="col">目前進度</th>
                            <th scope="col">I線</th>
                            <th scope="col">距I線張數</th>
                            <th scope="col">預測{{analyzeResult.monthNum}}個月後進度</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row" id = "Date">{{analyzeResult.year + '/' + analyzeResult.month}}</th>
                            <th id = "grade">{{analyzeResult.grade}}</th>
                            <th id = "math">數學:{{analyzeResult.progress.math}}</th>
                            <th id = "ILine" scope="row">{{analyzeResult.progress.ILine}}</th>
                            <th id = "mathI">數學:{{analyzeResult.progress.mathI}}</th>
                            <th id = "predictProgressMath">{{analyzeResult.predictMath}}</th>
                        </tr>
                        <tr>
                            <th scope="row"></th>
                            <th ></th>
                            <th id = "chinese">國語:{{analyzeResult.progress.chinese}}</th>
                            <th></th>
                            <th id = "chineseI">國語:{{analyzeResult.progress.chineseI}}</th>
                            <th id = "predictProgressChinese">{{analyzeResult.predictChinese}}</th>
                        </tr>
                        <tr style="border-width: 10px;">
                            <th ></th>
                            <th ></th>
                            <th id = "english">英文:{{analyzeResult.progress.english}}</th>
                            <th></th>
                            <th id = "englishI">英文:{{analyzeResult.progress.englishI}}</th>
                            <th id = "predictProgressEnglish">{{analyzeResult.predictEnglish}}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="analyzeHistory" id="chart3">
                <div class="analyzedTableOld" style="border-bottom: black 3px dashed;">
                    <table class="table analyzedTableOld" style="margin-top: 3%;">
                        <thead class="thead-light">
                            <tr>
                                <th scope="col">年/月</th>
                                <th scope="col">學年</th>
                                <th scope="col">目前進度</th>
                                <th scope="col">I線</th>
                                <th scope="col">距I線張數</th>
                                <th scope="col">預測{{analyzeHistory[displayPage].predict.after}}個月後進度</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" id = "Date">{{analyzeHistory[displayPage].year + '/' + analyzeHistory[displayPage].month}}</th>
                                <th id = "grade">{{analyzeHistory[displayPage].grade}}</th>
                                <th id = "math">數學:{{analyzeHistory[displayPage].progress.math}}</th>
                                <th id = "ILine" scope="row">{{analyzeHistory[displayPage].iLine}}</th>
                                <th id = "mathI">數學:{{analyzeHistory[displayPage].ILine.math}}</th>
                                <th id = "predictProgressMath">{{analyzeHistory[displayPage].predict.math}}</th>
                            </tr>
                            <tr>
                                <th scope="row"></th>
                                <th ></th>
                                <th id = "chinese">國語:{{analyzeHistory[displayPage].progress.chinese}}</th>
                                <th></th>
                                <th id = "chineseI">國語:{{analyzeHistory[displayPage].ILine.chinese}}</th>
                                <th id = "predictProgressChinese">{{analyzeHistory[displayPage].predict.chinese}}</th>
                            </tr>
                            <tr style="border-width: 10px;">
                                <th ></th>
                                <th ></th>
                                <th id = "english">英文:{{analyzeHistory[displayPage].progress.english}}</th>
                                <th></th>
                                <th id = "englishI">英文:{{analyzeHistory[displayPage].ILine.english}}</th>
                                <th id = "predictProgressEnglish">{{analyzeHistory[displayPage].predict.english}}</th>
                            </tr>
                        </tbody>
                    </table>
                    <div class="analyzeArrowArea" style="display: inline;">
                        <img class="analyzeLastPage" src="/img/arrow-left.jpeg" @click="lastPage" height="50" width="50">
                        <img class="analyzeNextPage" src="/img/arrow-right.jpg" @click="nextPage" height="50" width="50" style="margin-left: 90%;">
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
            inputYear: "",
            inputMonth: "",
            inputMonthNum: "",
            inputMath: "",
            inputChinese: "",
            inputEnglish: "",
            studentRecord: null,
            analyzeResult: false,
            analyzeHistory: false,
            displayPage: null
        }
    },
    mounted: function() {
        let vm = this
        // get student record
        $.ajax({
            type: "GET",
            url: "/report/" + this.student.studentId,
            dataType: "json",
            headers : {
                "Authorization": Cookies.get("jwtToken")
            },
            success: function(response) {
                vm.studentRecord = response.progress;
            },
            error: function(err) {
                alert({err: err.message});
                return
            }
        });

        $.ajax({
            type: "GET",
            url: "/report/analyzeHistory/" + this.student.studentId,
            dataType: "json",
            headers : {
                "Authorization": Cookies.get("jwtToken")
            },
            success: function(response) {
                vm.analyzeHistory = response.analyzeData;
                if(vm.analyzeHistory) {
                    vm.displayPage = vm.analyzeHistory.length-1;
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
            vm.analyzeResult = false;
            vm.inputMath = "";
            vm.inputChinese = "";
            vm.inputEnglish = "";
            // get student record
            await $.ajax({
                type: "GET",
                url: "/report/" + newData.studentId,
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                success: function(response) {
                    vm.studentRecord = response.progress;
                },
                error: function(err) {
                    alert({err: err.message});
                    return
                }
            });

            await $.ajax({
                type: "GET",
                url: "/report/analyzeHistory/" + newData.studentId,
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                success: function(response) {
                    vm.analyzeHistory = response.analyzeData;
                    if(vm.analyzeHistory) {
                        vm.displayPage = vm.analyzeHistory.length-1;
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
    props: ["student", "show", "teacher"],
    methods: {
        lastPage() {
            if(this.displayPage == 0) {
                return
            }
            this.displayPage--;
        },

        nextPage() {
            if(this.displayPage >= this.analyzeHistory.length-1) {
                return
            }
            this.displayPage++;
        },

        analyze() {
            if(!this.inputYear || !this.inputMonth || !this.inputMonthNum || !this.inputMath || !this.inputChinese || !this.inputEnglish) {
                alert('資料不全');
            }
            for(record in this.studentRecord) {
                if(this.studentRecord[record].month == parseInt(this.inputMonth) && this.studentRecord[record].year == parseInt(this.inputYear)) {
                    this.analyzeResult = this.studentRecord[record];
                    break;
                }
            }
            this.analyzeResult.monthNum = this.inputMonthNum;
            this.analyzeResult.predictMath = this.analyzeResult.progress.math? calculateNewProgress(this.analyzeResult.progress.math, this.inputMath) : "";
            this.analyzeResult.predictChinese = this.analyzeResult.progress.chinese? calculateNewProgress(this.analyzeResult.progress.chinese, this.inputChinese) : "";
            this.analyzeResult.predictEnglish = this.analyzeResult.progress.english? calculateNewProgress(this.analyzeResult.progress.english, this.inputEnglish) : "";
            this.analyzeResult.progress.ILine = replaceSubjectTitleBack(this.analyzeResult.progress.ILine);

            // 重新渲染
            const temp = this.analyzeResult;
            this.analyzeResult = false;
            this.analyzeResult = temp;
        },

        store() {
            let vm = this;
            $.ajax({
                type: "POST",
                url: "/report/analyze/update",
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                data: {
                    studentId: vm.student.studentId, 
                    year: vm.analyzeResult.year, 
                    month: vm.analyzeResult.month, 
                    grade: vm.analyzeResult.grade, 
                    math: vm.analyzeResult.progress.math, 
                    chinese: vm.analyzeResult.progress.chinese, 
                    english: vm.analyzeResult.progress.english, 
                    mathI: vm.analyzeResult.progress.mathI, 
                    chineseI: vm.analyzeResult.progress.chineseI, 
                    englishI: vm.analyzeResult.progress.englishI,
                    ILine: vm.analyzeResult.progress.ILine,
                    predictRange: vm.analyzeResult.monthNum, 
                    predictMath: vm.analyzeResult.predictMath, 
                    predictChinese: vm.analyzeResult.predictChinese, 
                    predictEnglish: vm.analyzeResult.predictEnglish
                },
                success: function(response) {
                    alert("儲存成功");
                    $.ajax({
                        type: "GET",
                        url: "/report/analyzeHistory/" + vm.student.studentId,
                        dataType: "json",
                        headers : {
                            "Authorization": Cookies.get("jwtToken")
                        },
                        success: function(response) {
                            vm.analyzeHistory = response.analyzeData;
                            if(vm.analyzeHistory) {
                                vm.displayPage = vm.analyzeHistory.length-1;
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

function calculateNewProgress(now, predict) {
    let newProgress = {};
    predict = Number(predict);
    now = replaceSubjectTitle(now);
    newProgress.level = (predict + now.charCodeAt(0) * 200 + Number(now.substring(1 , now.length)) ) / 200;
    newProgress.number = (predict + now.charCodeAt(0) * 200 + Number(now.substring(1 , now.length)) ) % 200;
    newProgress.level = replaceSubjectTitleBack(String.fromCharCode(newProgress.level));
    newProgress.number = newProgress.number.toString();
    return newProgress.level + newProgress.number;
}
function replaceSubjectTitle(subject) {
    subject = subject.replace("5A", "=");
    subject = subject.replace("4A", ">");
    subject = subject.replace("3A", '?');
    subject = subject.replace("2A", "@");
    return subject;
}
function replaceSubjectTitleBack(subject) {
    subject = subject.replace("=", "5A");
    subject = subject.replace(">", "4A");
    subject = subject.replace("?", '3A');
    subject = subject.replace("@", "2A");
    return subject;
}
</script>