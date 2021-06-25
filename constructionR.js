function play(invoice) {
    let url = "plays.json";
    let request = new XMLHttpRequest();
    request.open("get",url);
    request.send(null);
    request.onload = function () {
        if(request.status == 200){
            plays = JSON.parse(request.response);
        }
        console.log(statement(invoice,plays));
    }
}
window.onload = function () {
    let url = "invoices.json";
    let request = new XMLHttpRequest();
    request.open("get",url);
    request.send(null);
    request.onload = function () {
        if(request.status == 200){
            invoice = JSON.parse(request.response);
        }
        play(invoice);
    }
}

function statement(invoice,plays){
    // let totalAmount=0;
    let result = 'Statement for '+invoice[0].customer +"\n";
    // const format = new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format;
    for(let perf of invoice[0].performances){
        // const play = plays[perf.playID];(查询取代临时变量178)
        // let thisAmount=amountFor(perf);//内联变量（123）
        // volumeCredits +=volumeCreditsFor(perf);（727应用拆分循环）
        // volumeCredits +=Math.max(perf.audience-30,0);
        // if("comedy"===playFor(perf).type) volumeCredits+= Math.floor(perf.audience/5);
        result+=playFor(perf).name+': '+usd(amountFor(perf))+ "("+perf.audience +' seats)\n'
        // totalAmount +=amountFor(perf)
    }
    // let volumeCredits=totalVolumeCredits();//（106提炼函数）
    // for(let perf of invoice[0].performances){
    //     volumeCredits +=volumeCreditsFor(perf);
    // }
    result += 'Amount owed is ' +usd(totalAmount())+'\n';
    result += 'You earned ' +totalVolumeCredits()+ ' credits\n';
    return result;

    function amountFor(aPerformance) {//改变函数声明，移除play（124）
        let result = 0;
        switch (playFor(aPerformance).type) {
            case "tragedy":
                result = 40000;
                if(aPerformance.audience>30){
                    result += 1000*(aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if(aPerformance.audience>20){
                    result +=10000 +500*(aPerformance.audience - 20);
                }
                result += 300* aPerformance.audience;
                break;
            default:
                throw new Error('unknown type: ' +playFor(aPerformance).type);
        }
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(perf) {
        let result = 0;
        result +=Math.max(perf.audience-30,0);

        if("comedy"===playFor(perf).type) result+= Math.floor(perf.audience/5);
        return result;
    }

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(aNumber/100);
    }

    function totalVolumeCredits() {
        let result=0;
        for(let perf of invoice[0].performances){
            result +=volumeCreditsFor(perf);
        }
        return result;
    }
    function totalAmount() {
        let result=0;
        for(let perf of invoice[0].performances){
            result +=amountFor(perf)
        }
        return result;
    }
}

