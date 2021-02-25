var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.setValue(getStub("c"))
editor.session.setMode("ace/mode/c_cpp");
editor.setOptions({
    enableLiveAutocompletion: true,
    enableSnippets: true
});

function getID(lang) {
    switch (lang) {
        case "c":
            return 7;
        case "cpp":
            return 77;
        case "java":
            return 8;
        case "python":
            return 0;
        case "javascript":
            return 4;
    }
}

$("#theme").change(function () {
    console.log($(this).val());

    editor.setTheme("ace/theme/" + $(this).val());
});

function getStub(lang) {
    switch (lang) {
        case "c":
            return "#include<stdio.h>\n\nint main(){\n\tprintf(\"Hello\");\n}";
        case "cpp":
            return "#include<iostream>\n#include<cstdio>\n#include<cmath>\nusing namespace std;\nint main(){\n\treturn 0;\n}"
        case "java":
            return "import java.util.Scanner;\n// Other imports go here\n// Do NOT change the class name\nclass Main{     \n\tpublic static void main(String[] args){\n\t\t// Write your code here \n\t}\n}";
        case "python":
            return "#Type your code here";
        case "javascript":
            return "//Type your code here";
    }
}

$("#lang").change(function () {

    console.log($(this).val());
    const lang = $(this).val();
    editor.setValue(getStub(lang))
    if (lang === "c" || lang === "cpp")
        editor.session.setMode("ace/mode/c_cpp");
    else
        editor.session.setMode("ace/mode/" + $(this).val());
});

$("#submit").click(function () {
    const url = "https://codequotient.com/api/executeCode";
    const lang = $("#lang").val();
    const id = getID(lang);

    const data = {
        code: editor.getValue(),
        langId: id
    };


    $.post(url, data, function (result) {
        $("#console").text("Compiling...");

        var getUrl = "https://codequotient.com/api/codeResult/" + result.codeId;

        setTimeout(() => {
            $.get(getUrl, function (data) {
                var output = JSON.parse(data.data);
                if (output.errors) {
                    $("#console").text(output.errors);
                }
                else {
                    $("#console").text(output.output);
                }
                console.log(output);
            })
        }, 5000);



        console.log(result);
    });

    console.log(lang, id);
});
