function createNewProjectDirectory(){
        // alert("test");
        // Ask the user for project name
        var projectName = prompt("Enter project name", "TMP_Template");

        // Ask the user to choose the destination directory
        var destFolder = Folder.selectDialog("Select the destination folder:");

        if (destFolder) {
            var baseFolderPath = destFolder.absoluteURI + "/" + projectName;
            var pnameArr = projectName.split('_');
            var tmp = pnameArr[0];
            alert(pnameArr[0]);

            // List all folder paths in the structure
            var folderPaths = [
                "/01_DOCUMENTS/Please create descriptive folder name",
                "/04_FINISHING/01_PREPS",
                "/04_FINISHING/02_FINISHES IN HOUSE/PROJECT_TYPE_SPOTNAME_SIZE_FINISH",
                "/05_"+ tmp +"_GFX/0_Template",
                "/05_"+ tmp +"_GFX/1_3D/aa/PRJ",
                "/05_"+ tmp +"_GFX/1_3D/aa/RNDR",
                "/05_"+ tmp +"_GFX/2_AEP",
                "/05_"+ tmp +"_GFX/3_ASSETS/1_PSD",
                "/05_"+ tmp +"_GFX/3_ASSETS/2_ILL",
                "/05_"+ tmp +"_GFX/3_ASSETS/3_WEB",
                "/05_"+ tmp +"_GFX/3_ASSETS/4_CLIENT/_YYMMDD",
                "/05_"+ tmp +"_GFX/3_ASSETS/5_FNTS",
                "/05_"+ tmp +"_GFX/3_ASSETS/_RATING",
                "/05_"+ tmp +"_GFX/4_FTG/1_PRNDR",
                "/05_"+ tmp +"_GFX/4_FTG/2_AUD",
                "/05_"+ tmp +"_GFX/4_FTG/3_STK",
                "/05_"+ tmp +"_GFX/5_ToGFX/_YYMMDD",
                "/05_"+ tmp +"_GFX/6_OUT/_FIN",
                "/05_"+ tmp +"_GFX/6_OUT/_PRES/_YYMMDD",
                "/05_"+ tmp +"_GFX/6_OUT/_SFS/_YYMMDD",
                "/05_"+ tmp +"_GFX/6_OUT/_SLTS",
                "/05_"+ tmp +"_GFX/6_OUT/_SOC",
                "/06_AE_Exports",
                "/08_TRANSCRIPTS"
            ];


            // Create the folders
            for (var i = 0; i < folderPaths.length; i++) {
                var fullPath = baseFolderPath + folderPaths[i];
                var folder = new Folder(fullPath);
                if (!folder.exists) {
                    folder.create();
                }
            }
            alert("Folder structure created successfully!");
        } else {
            alert("Operation cancelled or destination folder not selected.");
        }

    }