
function play(invoice) {
    let url = "plays.json";
    let request = new XMLHttpRequest();
    request.open("get",url);
    request.send(null);
    request.onload = function () {
        if(request.status == 200){
            plays = JSON.parse(request.response);
        }
        console.log(invoice,plays);
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
        console.log(invoice);
        console.log(invoice[0].performances);
        play(invoice);
    }
}


function statement(invoice,plays){
    let totalAmount=0;
    let volumeCredits=0;
    let result = 'Statement for '+invoice[0].customer +"\n";
    const format = new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format;
    for(let perf of invoice[0].performances){
        const play = plays[perf.playID];
        let thisAmount = 0;

        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if(perf.audience>30){
                    thisAmount += 1000*(perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if(perf.audience>20){
                    thisAmount +=10000 +500*(perf.audience - 20);
                }
                thisAmount += 300* perf.audience;
                break;
            default:
                throw new Error('unknown type:${play.type}');
        }

        volumeCredits +=Math.max(perf.audience-30,0);

        if("comedy"===play.type) volumeCredits+= Math.floor(perf.audience/5);

        result+=play.name+': '+format(thisAmount/100)+ "("+perf.audience +' seats)\n'
        totalAmount +=thisAmount
    }
    result += 'Amount owed is ' +format(totalAmount/100)+'\n';
    result += 'You earned ' +volumeCredits+ ' credits\n';
    return result;
}
