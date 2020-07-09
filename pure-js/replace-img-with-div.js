html = ``
let newHtml = html;

[...html.matchAll(/<img((?:\n?.+?)+?)\/?>/g)].forEach(

    ([group0, group1]) => {

        const [, styleGroup1, styleGroup2] = ([...group1.matchAll(/(style="((?:\n?.+?)+?)")/g)][0] || []);
        const [, srcGroup1, srcGroup2] = ([...group1.matchAll(/(src="((?:\n?.+?)+?)")/g)][0] || []);

        const styleList = [
            `background: url('${srcGroup2}') no-repeat center center`,
            'background-size: contain',
            ...styleGroup1 ? [styleGroup2] : []
        ]
        let divAttributes = group1.replace(srcGroup1, '');
        if (styleGroup1) {
            divAttributes = divAttributes.replace(styleGroup1, '')
        }
        divAttributes += ` style="${styleList.join('; ')}"`

    
        newHtml = newHtml.replace(group0, `<div img ${divAttributes}></div>`)
    }
)
console.log(newHtml)
