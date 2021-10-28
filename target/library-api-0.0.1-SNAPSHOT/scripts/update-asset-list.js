document.addEventListener("DOMContentLoaded", function() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            console.log(JSON.parse(xhr.responseText));

            var assetList = JSON.parse(xhr.responseText);
            assetList.forEach(libAsset => {
                addAssetToTable(libAsset);
            });
        }
    }

    xhr.open('GET', '/library-api/api/library-asset');

    xhr.send();
});

function addAssetToTable(libAsset){
    var newRow = document.createElement('tr');
    var editIcon = document.createElement('td');
    var assetId = document.createElement('td');
    var title = document.createElement('td');
    var author = document.createElement('td');
    var mediaType = document.createElement('td');
    var language = document.createElement('td');
    var collection = document.createElement('td');
    var location = document.createElement('td');
    var loanType = document.createElement('td');
    var interLibLoan = document.createElement('td');

    editIcon.innerText = `<b>icon</b>`;
    assetId.innerText = libAsset.assetId;
    title.innerText = libAsset.title;
    author.innerText = libAsset.author;
    mediaType.innerText = libAsset.mediaType;
    language.innerText = libAsset.language;
    collection.innerText = libAsset.collection;
    location.innerText = libAsset.location;
    loanType.innerText = libAsset.loanType;
    if(libAsset.interLibLoan){
        interLibLoan.innerText = "Yes";
    }else{
        interLibLoan.innerText = "No";
    }
    
    newRow.appendChild(editIcon);
    newRow.appendChild(assetId);
    newRow.appendChild(title);
    newRow.appendChild(author);
    newRow.appendChild(mediaType);
    newRow.appendChild(language);
    newRow.appendChild(collection);
    newRow.appendChild(location);
    newRow.appendChild(loanType);
    newRow.appendChild(interLibLoan);

    document.getElementById('asset-list-body').appendChild(newRow);
}