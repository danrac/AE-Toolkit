// Create the UI window
var dialog = new Window("dialog", "Apply Scale to Layers");
dialog.orientation = "column";

// Add a group for the input fields
var inputGroup = dialog.add("group");
inputGroup.orientation = "row";
inputGroup.add("statictext", undefined, "Comp Name:");
var compNameInput = inputGroup.add("edittext", undefined, "CompName");
inputGroup.add("statictext", undefined, "Scale X:");
var scaleXInput = inputGroup.add("edittext", undefined, "2.0");
inputGroup.add("statictext", undefined, "Scale Y:");
var scaleYInput = inputGroup.add("edittext", undefined, "1.5");

// Add a button to submit the action
var buttonGroup = dialog.add("group");
var submitButton = buttonGroup.add("button", undefined, "Apply Scale");
submitButton.onClick = function() {
  // Get the user-defined variables
  var compName = compNameInput.text;
  var scaleX = parseFloat(scaleXInput.text);
  var scaleY = parseFloat(scaleYInput.text);

  // Main function to apply scale to layers
  function applyScaleToLayers(comp, x, y) {
    // alert(1);
    // Iterate through all layers in the composition
    for (var i = 1; i <= comp.numLayers; i++) {
      // alert(2);
      var layer = comp.layer(i);
      // Apply scale only to visible layers
      if (layer.enabled && !layer.locked) {
        // Apply scale values
        layer.scale.setValue([x, y]);
      }
    }
  }

  // Check if the composition exists and apply scale
  function processComposition(comp) {
    if (comp.name === compName) {
      // Apply scale to the layers in the composition
      // alert(0);
      applyScaleToLayers(comp, scaleX, scaleY);
    }
  }

  // Iterate through all selected compositions
  for (var i = 1; i <= app.project.selection.length; i++) {
    var selectedItem = app.project.selection[i];
    if (selectedItem instanceof CompItem) {
      // alert(0);
      // Process selected composition
      processComposition(selectedItem);
    }
  }

  // Close the dialog
  dialog.close();
};

// Show the UI window
dialog.show();
