(function SpellChecker(thisObj) {

var scriptFile  = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;
var filePath = scriptPath;

var masterPanel = null;

var wordlistFile = File(filePath + "/wordlist.txt");
var words = new Array();

if(wordlistFile.exists){
    wordlistFile.open();
    var content = wordlistFile.read();
    wordlistFile.close();
    words = content.split("\n");
}

const Trie = function(){
        this.root = {};
}

    Trie.prototype.insert = function(word) {
        var node = this.root;
        var wdSplit = word.split('');
        for(var i = 0; i <= wdSplit.length - 1; i++){
            if (!node[wdSplit[i]]) {
                node[wdSplit[i]] = {};
            }
            node = node[wdSplit[i]];
        }
        node.isEndOfWord = true;
    }

    Trie.prototype.search = function(word) {
        var node = this.root;
        var wdSplit = word.split('');
        for(var i = 0; i <= wdSplit.length - 1; i++){
            if (!node[wdSplit[i]]) {
                return false;
            }
            node = node[wdSplit[i]];
        }
        return node.isEndOfWord === true;
    }

    Trie.prototype.suggest = function(word) {
        var node = this.root;
        suggestions = [];
        var wdSplit = word.split('');

        for(var i = 0; i <= wdSplit.length - 1; i++){
            if (!node[wdSplit[i]]) {
                return [];
            }
            node = node[wdSplit[i]];
        }
        this.findWords(node, word, suggestions);
        return suggestions;
    }

    Trie.prototype.findWords = function(node, prefix, suggestions) {
        if (node.isEndOfWord) {
            suggestions.push(prefix);
        }
        for(wd in node){
            if (wd !== 'isEndOfWord') {
                this.findWords(node[wd], prefix + wd, suggestions);
            }
        }

    }

const SpellChecker = function(){
        this.trie = new Trie();
}

    SpellChecker.prototype.loadDictionary = function(word) {
        for(var i = 0; i <= words.length - 1; i++){
            this.trie.insert(words[i]);
        }
    }

    SpellChecker.prototype.check = function(word) {
        if (this.trie.search(word)) {
            return word + " was found.";
        } else {
            // return {
            //     word,
            //     correct: false,
            //     suggestions: this.trie.suggest(word)
            // };
            var suggs = this.trie.suggest(word);
            return word + " was not found.\n" + suggs.join(',');
        }
    }

const spellChecker = new SpellChecker();
spellChecker.loadDictionary(words);


////////////// BUILD UI ///////////////////////////////

function SpellChecker_buildUI(thisObj) {
    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "SpellChecker", undefined, { resizeable: true, closeButton: true });
        if (pal != null) {
            masterPanel = pal.add("panel", undefined, "");

            if(masterPanel == null){


            } else {

                var scgrp = masterPanel.add('Panel', undefined, "SPELLCHECKER");
                var wordInput = scgrp.add('EditText', undefined, '');
                wordInput.size = [150, 25];

                var SpellCheckBtn = scgrp.add('Button', undefined, "SPELL CHECK");
                SpellCheckBtn.size = [100, 25];
                SpellCheckBtn.onClick = function(){
                    alert(spellChecker.check(wordInput.text));
                }

                pal.layout.layout(true);
                pal.layout.resize();
            }
        }
        return pal;
    }

    var rdetPal = SpellChecker_buildUI(thisObj);
    if (rdetPal != null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        }
        else
            rdetPal.layout.layout(true);
        }
    }
)(this);