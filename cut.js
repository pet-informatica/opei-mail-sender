const fs = require('fs');
const scissors = require('scissors');
const async = require('async');
const pdf = scissors('./files/CCI.pdf');
const allEmails = [];

const search = (arr, el) => {
    let index = -1;
    arr.forEach((e, i) => (e.to === el ? index = i : ''))
    return index;
}

const add = (arr, el, i, tipo) => {
    const index = search(arr, el);
    if (index >= 0) arr[index].pages.push(i + 1);
    else {
        arr.push({
            from: 'pet-informatica',
            to: el,
            tipo: tipo,
            pages: [i + 1]
        });
    }
}


const cut = (email, cb) => {
    const cuted = pdf.pages(...email.pages);
    const output = `./outputs/cut-${email.tipo}-${email.to}.pdf`;
    const stream = fs.createWriteStream(output, { autoClose: false });

    cuted.pdfStream()
        .pipe(stream)
        .on('finish', () => {
            email.doc = output;
            allEmails.push(email);
            stream.close();
            cb(null, output);
        }).on('error', e => cb(e));
}

fs.readFile('./files/emails.csv', 'utf8', (err, contents) => {
    if (err) throw err;
    console.log("Organizando objeto de emails de acordo com a entrada CSV.");

    const lines = contents.split('\n');
    const alunos = [], delegados = [], instituicoes = [];

    lines.forEach((line, i) => {
        const arr = line.split(',');
        const aluno = arr[0];
        const delegado = arr[1];
        const instituicao = arr[2];

        add(alunos, aluno, i, 'aluno');
        add(delegados, delegado, i, 'delegado');
        add(instituicoes, instituicao, i, 'instituicao');
    });

    console.log("Cortando PDF's...");
    let count = 1;
    const all = alunos.concat(delegados).concat(instituicoes);
    async.eachSeries(all, (email, cb) => {
        cut(email, (e, output) => {
            console.log(`Cortado: ${output} (${count++} de ${all.length})`);
            cb(e)
        });
    }, e => {
        if (e) console.log(e);
        console.log("Done!!");
        console.log(allEmails);
        const obj = JSON.stringify(allEmails);
        fs.writeFile('./emails.json', obj);
    });
});

