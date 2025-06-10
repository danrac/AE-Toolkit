function AddBurn() {
    // Check if there's an active composition
    if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
        var comp = app.project.activeItem;
        var offsetX = 10;
        var offsetY = comp.height - 10;
        var textalignment = ParagraphJustification.LEFT_JUSTIFY;
        var compInfoText = comp.layers.addText("temp text");
        compInfoText.transform.position.setValue([offsetX, offsetY]);
        var textLayerPosExpression = "[" + offsetX + "," + offsetY + "];";
        compInfoText.transform.position.expression = textLayerPosExpression;
        compInfoText.opacity.setValue(25);
        compInfoText.name = "Frame counter info";
        var textLayerExpression = " thisComp.name + \"   \"  + timeToCurrentFormat(time) + \"   FPS: \" + (1.0 / thisComp.frameDuration).toFixed(3);";
        compInfoText.sourceText.expression = textLayerExpression;
        var mainTextDocument = compInfoText.property("ADBE Text Properties").property("ADBE Text Document");
        var textDocument1 = mainTextDocument.value;
        textDocument1.resetCharStyle();
        textDocument1.fontSize = 12;   
        textDocument1.fillColor = [1, 1, 1];
        textDocument1.font = "Myriad";
        textDocument1.text = "";
        textDocument1.justification = textalignment;
        mainTextDocument.setValue(textDocument1);

    } else {
        alert("Please select a composition.");
    }
}