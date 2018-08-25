const fs = require('fs');

const search = (arr, el) => {
    let index = -1;
    arr.forEach((e, i) => (e.to === el ? index = i : ''))
    return index;
}

const add = (arr, el, i, tipo) => {
    const index = search(arr, el);
    if (index >= 0) arr[index].docs.push(i);
    else {
        arr.push({
            from: 'pet-informatica',
            to: el,
            tipo: tipo,
            docs: [i]
        });
    }
}

fs.readFile('./files/emails.csv', 'utf8', (err, contents) => {
    if (err) throw err;
    const lines = contents.split('\n');

    const emails = {
        alunos: [],
        delegados: [],
        instituicoes: []
    }

    const docs = lines.forEach((line, i) => {
        let email = {
            from: 'pet-informatica'
        }

        const arr = line.split(',');
        const aluno = arr[0];
        const delegado = arr[1];
        const instituicao = arr[2];

        add(emails.alunos, aluno, i, 'aluno');
        add(emails.delegados, delegado, i, 'delegado');
        add(emails.instituicoes, instituicao, i, 'instituicao');
    });

    console.log(JSON.stringify(emails));
});

// /* Cortando o PDF */
// const fs = require('fs');
// const scissors = require('scissors');

// const pdf = scissors('CCI.pdf').range(1, 2);

// pdf.pdfStream()
// .pipe(fs.createWriteStream('./cut1.pdf'))
// .on('finish', function () {
//     console.log("PDF cortado com sucesso.");
// }).on('error', function (err) {
//     throw err;
// });