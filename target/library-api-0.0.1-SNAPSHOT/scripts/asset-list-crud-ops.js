// Retrieve data for the asset table when the page loads
document.addEventListener("DOMContentLoaded", function() {
    refreshTable();

    //setTimeout( () => deleteRowById(2), 4000);
});



//Refresh the table when the 'Refresh Table' option is clicked
document.getElementById('refresh-table-anchor').onclick = function() {
    //console.log('Refresh anchor was clicked');
    refreshTable();
}



// refreshTable: Send an http get request and, if it completes, clear the asset table
//  and reload all the newly retrieved assets
//  this is basically the retrieveAll function
function refreshTable() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            //console.log(JSON.parse(xhr.responseText));

            var assetList = JSON.parse(xhr.responseText);

            document.getElementById('asset-list-body').innerHTML = '';
            //console.log("Table body contents: \n" + document.getElementById('asset-list-body').innerHTML);

            assetList.forEach(libAsset => {
                addAssetToTable(libAsset);
            });
        }
    }

    xhr.open('GET', '/library-api/api/library-asset');

    xhr.send();
}



// addAssetToTable: take the data from libAsset (a library asset object) and put it
//  into a row in the asset list table.
function addAssetToTable(libAsset){
    // create the row and data elements to add to the asset list table
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

    // create the html for a clickable icon to include in the first column
    // clicking will bring up a modal to update the item
    var pencilIcon = 
    `<a href="#" onclick="prepareUpdateForm(this)" data-bs-toggle="modal" data-bs-target="#update-asset-modal">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <title>Edit Asset</title>
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg></a>`;

    // set the values for each data element
    editIcon.innerHTML = pencilIcon;
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

    // add the data elements to the row
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

    // add the row to the table body
    document.getElementById('asset-list-body').appendChild(newRow);
}




// When the Save Asset button in the New Asset modal is clicked, put the values
//  from the form inputs into a library asset object
document.getElementById('add-asset-form').addEventListener('submit', function(event){
    console.log('Save Asset submit button was clicked');

    event.preventDefault(); // prevent default form actions from occuring

    // Retrieve data from the New Asset form
    var newTitle = document.getElementById('new-title-input').value;
    var newAuthor = document.getElementById('new-author-input').value;
    var newMediaType = document.getElementById('new-media-type-input').value;
    var newLanguage = document.getElementById('new-language-input').value;
    var newCollection = document.getElementById('new-collection-input').value;
    var newLocation = document.getElementById('new-location-input').value;
    var newLoanType = document.getElementById('new-loan-type-input').value;
    var newInterLibLoan = document.getElementById('new-inter-lib-loan-input').checked;

    // put the data into a library asset object
    var libAsset = {
        title : newTitle,
        author : newAuthor,
        mediaType : newMediaType,
        language : newLanguage,
        collection : newCollection,
        location : newLocation,
        loanType : newLoanType,
        interLibLoan : newInterLibLoan
    };

    // send the library asset to be saved (also send the form element to be reset later)
    saveAsset(libAsset, this);
});




// saveAsset: send the library asset in an html post request and, if the request completes,
//  add the asset to the asset list and reset the form.
function saveAsset(libAsset, formElement){
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            // get the new library asset with a generated id
            var updatedAsset = JSON.parse(xhr.responseText);

            // add the new asset to the table
            addAssetToTable(updatedAsset);

            // clear the new asset form
            formElement.reset();

            // let the user know what the new id is
            alert('Asset created with ID: ' + updatedAsset.assetId);
        }
    }

    xhr.open('POST', '/library-api/api/library-asset');

    xhr.send(JSON.stringify(libAsset));
}


// When the Update Asset button in the Update Asset modal is clicked, put the values
//  from the form inputs into a library asset object and then pass that to the
//  updateAsset function to send an http put request
document.getElementById('update-asset-form').addEventListener('submit', function(event){
    console.log('Update Asset submit button was clicked');

    event.preventDefault(); // prevent default form actions from occuring

    // Retrieve data from the Update Asset form
    var newAssetId = document.getElementById('update-asset-id-input').value;
    var newTitle = document.getElementById('update-title-input').value;
    var newAuthor = document.getElementById('update-author-input').value;
    var newMediaType = document.getElementById('update-media-type-input').value;
    var newLanguage = document.getElementById('update-language-input').value;
    var newCollection = document.getElementById('update-collection-input').value;
    var newLocation = document.getElementById('update-location-input').value;
    var newLoanType = document.getElementById('update-loan-type-input').value;
    var newInterLibLoan = document.getElementById('update-inter-lib-loan-input').checked;

    // put the data into a library asset object
    var libAsset = {
        assetId : newAssetId,
        title : newTitle,
        author : newAuthor,
        mediaType : newMediaType,
        language : newLanguage,
        collection : newCollection,
        location : newLocation,
        loanType : newLoanType,
        interLibLoan : newInterLibLoan
    };

    // send the library asset to be updated
    updateAsset(libAsset);
});




function updateAsset(libAsset){
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            deleteRowByAssetId(libAsset.assetId);
            addAssetToTable(libAsset);
            
            alert('Asset with ID ' + updatedAsset.assetId + ' was updated.');
        }
    }

    xhr.open('PUT', '/library-api/api/library-asset');

    xhr.send(JSON.stringify(libAsset));
}



document.getElementById('delete-asset-form').addEventListener('submit', function(event){
    console.log('Delete Asset submit button was clicked');

    event.preventDefault(); // prevent default form actions from occuring

    // Retrieve data from the Update Asset form
    var delAssetId = document.getElementById('delete-asset-id-input').value;
    var delTitle = document.getElementById('delete-title-input').value;
    var delAuthor = document.getElementById('delete-author-input').value;
    var delMediaType = document.getElementById('delete-media-type-input').value;
    var delLanguage = document.getElementById('delete-language-input').value;
    var delCollection = document.getElementById('delete-collection-input').value;
    var delLocation = document.getElementById('delete-location-input').value;
    var delLoanType = document.getElementById('delete-loan-type-input').value;
    var delInterLibLoan = document.getElementById('delete-inter-lib-loan-input').checked;

    // put the data into a library asset object
    var libAsset = {
        assetId : delAssetId,
        title : delTitle,
        author : delAuthor,
        mediaType : delMediaType,
        language : delLanguage,
        collection : delCollection,
        location : delLocation,
        loanType : delLoanType,
        interLibLoan : delInterLibLoan
    };

    // send the library asset to be updated
    if(confirm('Are you sure you want to delete asset with ID ' + delAssetId + '?'))
        deleteAsset(libAsset);
});


function deleteAsset(libAsset){
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            deleteRowByAssetId(libAsset.assetId);
            
            alert('Asset with ID ' + libAsset.assetId + ' was deleted.');
        }
    }

    xhr.open('DELETE', '/library-api/api/library-asset');

    xhr.send(JSON.stringify(libAsset));
}



function findRowByAssetId(id){
    allRows = document.getElementById('asset-list-body').children;

    if( allRows.length <= 0 ){
        console.log('Nothing in allRows');
        return null;
    }

    for(let i=0; i < allRows.length; i++){
        let data = allRows[i].children;
        if(data[1].innerText == id)
            return allRows[i];
    }

    console.log('No match');
    return null;
}



function deleteRowByAssetId(id){
    allRows = document.getElementById('asset-list-body').children;

    if( allRows.length <= 0 ){
        console.log('Nothing in allRows.  Cannot delete.');
    }

    for(let i=0; i < allRows.length; i++){
        let data = allRows[i].children;
        if(data[1].innerText == id){
            document.getElementById('asset-list-body').deleteRow(i);
            return;
        }
    }

    console.log('No matching id found.  Cannot delete.');
}



document.getElementById('update-asset-id-input').addEventListener('focusout', function(event){
    let id = document.getElementById('update-asset-id-input').value;
    let rowToUpdate = findRowByAssetId(id);

    console.log('Focusout event called');
    console.log(rowToUpdate);

    if(rowToUpdate != null){
        fillUpdateForm(rowToUpdate);
        disableUpdateForm(false);
    }
    else{
        clearUpdateForm();
        alert('Unable to find matching ID');
    }
});



function fillUpdateForm(rowToUpdate){
    let data = rowToUpdate.children;

    document.getElementById('update-asset-id-input').value = data[1].innerText;
    document.getElementById('update-title-input').value = data[2].innerText;
    document.getElementById('update-author-input').value = data[3].innerText;
    document.getElementById('update-media-type-input').value = data[4].innerText;
    document.getElementById('update-language-input').value = data[5].innerText;
    document.getElementById('update-collection-input').value = data[6].innerText;
    document.getElementById('update-location-input').value = data[7].innerText;
    document.getElementById('update-loan-type-input').value = data[8].innerText;
    document.getElementById('update-inter-lib-loan-input').checked = (data[9].innerText == 'Yes'); 
}


function disableUpdateForm(shouldDisable){
    document.getElementById('update-title-input').disabled = shouldDisable;
    document.getElementById('update-author-input').disabled = shouldDisable;
    document.getElementById('update-media-type-input').disabled = shouldDisable;
    document.getElementById('update-language-input').disabled = shouldDisable;
    document.getElementById('update-collection-input').disabled = shouldDisable;
    document.getElementById('update-location-input').disabled = shouldDisable;
    document.getElementById('update-loan-type-input').disabled = shouldDisable;
    document.getElementById('update-inter-lib-loan-input').disabled = shouldDisable;
    document.getElementById('update-asset-submit-button').disabled = shouldDisable;
}



function prepareUpdateForm(element){
    selectedRow = element.parentElement.parentElement;

    fillUpdateForm(selectedRow);
    disableUpdateForm(false);
}



function clearUpdateForm(){
    document.getElementById('update-asset-form').reset();
    disableUpdateForm(true);
}


document.getElementById('delete-asset-id-input').addEventListener('focusout', function(event){
    let id = document.getElementById('delete-asset-id-input').value;
    let rowToUpdate = findRowByAssetId(id);

    console.log('Focusout event called');
    console.log(rowToUpdate);

    if(rowToUpdate != null){
        fillDeleteForm(rowToUpdate);
    }
    else{
        clearDeleteForm();
        alert('Unable to find matching ID');
    }
});


function fillDeleteForm(rowToUpdate){
    let data = rowToUpdate.children;

    document.getElementById('delete-asset-id-input').value = data[1].innerText;
    document.getElementById('delete-title-input').value = data[2].innerText;
    document.getElementById('delete-author-input').value = data[3].innerText;
    document.getElementById('delete-media-type-input').value = data[4].innerText;
    document.getElementById('delete-language-input').value = data[5].innerText;
    document.getElementById('delete-collection-input').value = data[6].innerText;
    document.getElementById('delete-location-input').value = data[7].innerText;
    document.getElementById('delete-loan-type-input').value = data[8].innerText;
    document.getElementById('delete-inter-lib-loan-input').checked = (data[9].innerText == 'Yes'); 
}


function clearDeleteForm(){
    document.getElementById('delete-asset-form').reset();
}