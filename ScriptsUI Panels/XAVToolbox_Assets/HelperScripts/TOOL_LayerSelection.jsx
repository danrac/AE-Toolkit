function MakeSelection(SelectionType, LabelColor, LabelColorInt, SelectionOp){
    var comp = app.project.activeItem;
    if(comp == null){
        alert("Please select a comp.");
    }else{
        comp.selected = true;
        comp.openInViewer();
    }
    var layerCollection =  comp.layers;
    if(SelectionType != "None"){
        if(SelectionOp == "Only"){
            deselectAllLayers();
            for (var i = 1; i <= layerCollection.length; i++){
                var layerItem = layerCollection[i].source;
                if(SelectionType == "Nulls"){
                    if (layerCollection[i].nullLayer){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Solids"){
                    if (layerCollection[i] instanceof ShapeLayer){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i] instanceof CameraLayer){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i] instanceof LightLayer){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i].source.mainSource instanceof SolidSource){
                        if (layerCollection[i].nullLayer){
                            layerCollection[i].selected = false;
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
                if(SelectionType == "Shapes"){
                    if(layerCollection[i] instanceof ShapeLayer){
                        if (layerCollection[i].nullLayer){
                            layerCollection[i].selected = false;
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
                if(SelectionType == "Comps"){
                    if (layerItem instanceof CompItem){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Cameras"){
                    if (layerCollection[i] instanceof CameraLayer){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Lights"){
                    if (layerCollection[i] instanceof LightLayer){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Footage"){
                    if (layerItem instanceof FootageItem && !layerCollection[i].nullLayer){
                        if(layerCollection[i].source.mainSource instanceof SolidSource){
                            layerCollection[i].selected = false;
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
                if(SelectionType == "Text"){
                    if (!layerCollection[i].nullLayer){
                        if(layerCollection[i].Text == null){
                            layerCollection[i].selected = false;
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
            }
        }

        if(SelectionOp == "Add"){
            for (var i = 1; i <= layerCollection.length; i++){
                var layerItem = layerCollection[i].source;
                if(SelectionType == "Nulls"){
                    if (layerCollection[i].nullLayer){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Solids"){
                    if (layerCollection[i] instanceof ShapeLayer && layerCollection[i].selected){
                        layerCollection[i].selected = true;
                    }else if(layerCollection[i] instanceof CameraLayer && layerCollection[i].selected){
                        layerCollection[i].selected = true;
                    }else if(layerCollection[i] instanceof LightLayer && layerCollection[i].selected){
                        layerCollection[i].selected = true;
                    }else if (layerCollection[i] instanceof ShapeLayer && !layerCollection[i].selected){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i] instanceof CameraLayer && !layerCollection[i].selected){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i] instanceof LightLayer && !layerCollection[i].selected){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i].source.mainSource instanceof SolidSource){
                        if (layerCollection[i].nullLayer){
                            if(layerCollection[i].selected){
                                layerCollection[i].selected = true;
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
                if(SelectionType == "Shapes"){
                    if(layerCollection[i] instanceof ShapeLayer){
                        if (layerCollection[i].nullLayer){
                            layerCollection[i].selected = false;
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
                if(SelectionType == "Comps"){
                    if (layerItem instanceof CompItem){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Cameras"){
                    if (layerCollection[i] instanceof CameraLayer){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Lights"){
                    if (layerCollection[i] instanceof LightLayer){
                        layerCollection[i].selected = true;
                    }
                }
                if(SelectionType == "Footage"){
                    if (layerItem instanceof FootageItem && !layerCollection[i].nullLayer){
                        if(layerCollection[i].source.mainSource instanceof SolidSource){
                            if(layerCollection[i].selected){
                                layerCollection[i].selected = true;
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
                if(SelectionType == "Text"){
                    if (!layerCollection[i].nullLayer){
                        if(layerCollection[i].Text == null){
                            if(layerCollection[i].selected){
                                layerCollection[i].selected = true;
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }else{
                            layerCollection[i].selected = true;
                        }
                    }
                }
            }
        }

        if(SelectionOp == "Subtract"){
            for (var i = 1; i <= layerCollection.length; i++){
                var layerItem = layerCollection[i].source;
                if(SelectionType == "Nulls"){
                    if (layerCollection[i].nullLayer){
                        layerCollection[i].selected = false;
                    }
                }
                if(SelectionType == "Solids"){
                     if (layerCollection[i] instanceof ShapeLayer && layerCollection[i].selected){
                        layerCollection[i].selected = true;
                    }else if(layerCollection[i] instanceof CameraLayer && layerCollection[i].selected){
                        layerCollection[i].selected = true;
                    }else if(layerCollection[i] instanceof LightLayer && layerCollection[i].selected){
                        layerCollection[i].selected = true;
                    } else if (layerCollection[i] instanceof ShapeLayer && !layerCollection[i].selected){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i] instanceof CameraLayer && !layerCollection[i].selected){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i] instanceof LightLayer && !layerCollection[i].selected){
                        layerCollection[i].selected = false;
                    }else if(layerCollection[i].source.mainSource instanceof SolidSource){
                        if (layerCollection[i].nullLayer){
                            if(layerCollection[i].selected){
                                layerCollection[i].selected = true;
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }else{
                            layerCollection[i].selected = false;
                        }
                    }
                }
                if(SelectionType == "Shapes"){
                    if(layerCollection[i] instanceof ShapeLayer){
                        if (layerCollection[i].nullLayer){
                            layerCollection[i].selected = false;
                        }else{
                            layerCollection[i].selected = false;
                        }
                    }
                }
                if(SelectionType == "Comps"){
                    if (layerItem instanceof CompItem){
                        layerCollection[i].selected = false;
                    }
                }
                if(SelectionType == "Cameras"){
                    if (layerCollection[i] instanceof CameraLayer){
                        layerCollection[i].selected = false;
                    }
                }
                if(SelectionType == "Lights"){
                    if (layerCollection[i] instanceof LightLayer){
                        layerCollection[i].selected = false;
                    }
                }
                if(SelectionType == "Footage"){
                    if (layerItem instanceof FootageItem && !layerCollection[i].nullLayer){
                        if(layerCollection[i].source.mainSource instanceof SolidSource){
                            if(layerCollection[i].selected){
                                layerCollection[i].selected = true;
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }else{
                            layerCollection[i].selected = false;
                        }
                    }
                }
                if(SelectionType == "Text"){
                    if (!layerCollection[i].nullLayer){
                        if(layerCollection[i].Text != null){
                            layerCollection[i].selected = false;
                        }
                    }
                }
            }
        }
    }

    if(LabelColor != "None"){
        if(SelectionOp == "Only"){
            deselectAllLayers();
            for (var i = 1; i <= layerCollection.length; i++){
                var layerItem = layerCollection[i].source;
                if(layerCollection[i].label == LabelColorInt){
                        layerCollection[i].selected = true;
                }
            }
        }
        if(SelectionOp == "Add"){
            for (var i = 1; i <= layerCollection.length; i++){
                var layerItem = layerCollection[i].source;
                if(layerCollection[i].label == LabelColorInt){
                        layerCollection[i].selected = true;
                }
            }
        }
        if(SelectionOp == "Subtract"){
            for (var i = 1; i <= layerCollection.length; i++){
                var layerItem = layerCollection[i].source;
                if(layerCollection[i].label == LabelColorInt){
                        layerCollection[i].selected = false;
                }
            }
        }
    }
}