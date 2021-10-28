document.addEventListener("DOMContentLoaded", function() {

    var toggleVisibility = function(isChecked, colElement){
        if(isChecked){
            colElement.style.visibility = "visible";
        }
        else{
            colElement.style.visibility = "collapse";
        }
    }

    document.getElementById('asset-id-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('asset-id-col'));
    });

    document.getElementById('title-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('title-col'));
    });

    document.getElementById('author-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('author-col'));
    });

    document.getElementById('media-type-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('media-type-col'));
    });

    document.getElementById('language-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('language-col'));
    });

    document.getElementById('collection-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('collection-col'));
    });

    document.getElementById('location-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('location-col'));
    });

    document.getElementById('loan-type-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('loan-type-col'));
    });

    document.getElementById('inter-lib-loan-check').addEventListener('change', function(){
        toggleVisibility(this.checked, document.getElementById('inter-lib-loan-col'));
    });

});