// INITIAL
//      Load asset table initially
document.addEventListener("DOMContentLoaded", function() {
    refreshTable();
});


// REFRESH CLICK -> RETRIEVE
//      Refresh the asset table when the 'Refresh Table' option is clicked
document.getElementById('refresh-table-anchor').onclick = function() {
    refreshTable();
}



// GET / REFRESH TABLE
//      Send get request, clear the asset table,
//      and reload all retrieved assets
function refreshTable() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            var assetList = JSON.parse(xhr.responseText);

            // clear asset table
            document.getElementById('asset-list-body').innerHTML = '';

            // add each asset to a row in the table
            assetList.forEach(libAsset => {
                addAssetToTable(libAsset);
            });
        }
    }

    xhr.open('GET', '/library-api/api/library-asset');

    xhr.send();
}


// SUBMIT -> CREATE, UPDATE, OR DELETE
//      handle the submit event from the manage asset form depending on the state of the form
document.getElementById('manage-asset-form').addEventListener('submit', function(event){
    event.preventDefault(); // prevent default form actions from occuring

    let state = document.getElementById('form-state').value;
    let libAsset = getAssetFormData();

    if(state == 'create'){
        libAsset.assetId = -1; // the id shouldn't be used but ensure its a number
        saveAsset(libAsset)
    } else if ( state == 'update'){
        updateAsset(libAsset);
    } else if ( state == 'delete'){
        // double-check that the asset should be deleted
        if(confirm('Are you sure you want to delete asset with ID ' + libAsset.assetId + '?'))
            deleteAsset(libAsset);
            setDeleteFormState();
    } else {
        console.log('Invalid state: ' + state);
    }
});


// POST / SAVE
//      send the library asset in an html post request and, if the request completes,
//      add the asset to the asset list and reset the form.
function saveAsset(libAsset){
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            // get the new library asset with a generated id
            var updatedAsset = JSON.parse(xhr.responseText);

            // add the new asset to the table
            addAssetToTable(updatedAsset);

            // reset the new asset form
            // this line is in here to avoid some cases of the post request failing
            setCreateFormState();

            // let the user know what the new id is
            alert('Asset created with ID: ' + updatedAsset.assetId);
        }
    }

    xhr.open('POST', '/library-api/api/library-asset');

    xhr.send(JSON.stringify(libAsset));
}


// PUT / UPDATE
//      send the library asset with updated fields in an html put request and, if 
//      the request completes, remove the old table entry and add a new one
function updateAsset(libAsset){
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            deleteRowByAssetId(libAsset.assetId);
            addAssetToTable(libAsset);
            
            alert('Asset with ID ' + libAsset.assetId + ' was updated.');
        }
    }

    xhr.open('PUT', '/library-api/api/library-asset');

    xhr.send(JSON.stringify(libAsset));
}


// DELETE
//      send an html delete request to delete the asset with an id matching the given object
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

// DELETE ICON
//      Delete the row and asset corresponding to the element
//      Called from anchor around the trash icon in the asset table
function deleteIconClick(element) {
    selectedRow = element.parentElement.parentElement;

    data = selectedRow.children;

    var libAsset = {
        assetId : data[1].innerText,
        title : data[2].innerText,
        author : data[3].innerText,
        mediaType : data[4].innerText,
        language : data[5].innerText,
        collection : data[6].innerText,
        location : data[7].innerText,
        loanType : data[8].innerText,
        interLibLoan : (data[9].innerText == 'Yes')
    };

    // Check that the asset really should be deleted
    if(confirm('Are you sure you want to delete asset with ID ' + libAsset.assetId + '?'))
        deleteAsset(libAsset);
}





/* ********************************************************* */

// TABLE MANIPULATIONS
//   add/delete rows from the table, etc

/* ********************************************************* */


// ASSET OBJECT -> TABLE ROW
//      take the data from libAsset (a library asset object) and put it
//      into a row in the asset list table.
function addAssetToTable(libAsset){

    // Create the row and data elements to add to the asset list table
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

    // This is the html for two clickable icons to put in the first column
    // Clicking the first (pencil) icon will bring up the manage-asset-modal in the 'update' state
    // Clicking the second (trash) icon will delete the row and its corresponding asset
    var pencilIcon = 
    `<a href="#" onclick="editIconClick(this)" data-bs-toggle="modal" data-bs-target="#manage-asset-modal">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <title>Edit Asset</title>
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg></a>
    <a href="#" onclick="deleteIconClick(this)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <title>Delete Asset</title>
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg></a>
    `;

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



// DELETE ROW BY ID
//      find the row matching the given asset id and remove it from the table
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




/* ********************************************************* */

//FORM MANIPULATIONS
//   change the form for adding, updating, or deleting assets

/* ********************************************************* */



// CLEAR -> 'DEFAULT' STATE
//      Clear the asset form and return it to the disabled "default" state
//      Triggered by closing the form's modal
function clearAssetForm(){
    document.getElementById('manage-asset-form').reset();
    document.getElementById('staticBackdropLabel').innerText = 'Manage Asset';
    document.getElementById('asset-submit-button').value = 'Submit';
    document.getElementById('form-state').value = 'default';
    disableAssetForm(true);
}




// ADD ASSET CLICK -> CREATE STATE
//      Put manage asset form into the 'create' state when 'Add Asset' is selected from dropdown
document.getElementById('new-asset-anchor').addEventListener('click', function(){
    setCreateFormState();
});


// 'CREATE' STATE
//      Put manage asset form into the 'create' state
function setCreateFormState() {
    // Make sure the form is clear of input
    document.getElementById('manage-asset-form').reset();

    // Set the header of the modal
    document.getElementById('staticBackdropLabel').innerText = 'Add New Asset';

    // Set the submit button text
    document.getElementById('asset-submit-button').value = 'Add Asset';

    // Set the form state so the submit button knows what to do
    document.getElementById('form-state').value = 'create';

    // Make sure everything except the id field is enabled
    disableAssetForm(false);
    document.getElementById('asset-id-input').disabled = true;

    // All fields are required except id and language
    requireAllFromAssetForm(true);
    document.getElementById('asset-id-input').required = false;
    document.getElementById('language-input').required = false;

    // Add some default values
    document.getElementById('media-type-input').value = 'Hardcover Book';
    document.getElementById('language-input').value = 'English';
    document.getElementById('location-input').value = 'Park Hill Library';
    document.getElementById('loan-type-input').value = 'Two Weeks';
}




// UPDATE ASSET CLICK -> 'UPDATE' STATE
//      Put manage asset form into the 'update' state when 'Update Asset' is clicked from the dropdown
document.getElementById('update-asset-anchor').addEventListener('click', function(){
    setUpdateFormState();
});

// 'UPDATE' STATE
//      Put manage asset form into the 'update' state
function setUpdateFormState() {
    // Make sure the form is clear of input
    document.getElementById('manage-asset-form').reset();

    // Set the header of the modal
    document.getElementById('staticBackdropLabel').innerText = 'Update Asset';

    // Set the submit button text
    document.getElementById('asset-submit-button').value = 'Update Asset';

    // Set the form state so the submit button knows what to do
    document.getElementById('form-state').value = 'update';

    // Make sure only the id input is enabled
    disableAssetForm(true);
    document.getElementById('asset-id-input').disabled = false;

    // All fields are required except language
    requireAllFromAssetForm(true);
    document.getElementById('language-input').required = false;
}


// EDIT ICON -> 'UPDATE' STATE
//      Put manage asset form into the 'update' state.  Load data into the form.
//      Called from anchor around pencil icon in the asset table
function editIconClick(element) {
    setUpdateFormState();

    selectedRow = element.parentElement.parentElement;

    fillAssetFormFromRow(selectedRow);
    disableAssetForm(false);
}




// DELETE ASSET CLICK -> 'DELETE' STATE
//      Put manage asset form into the 'delete' state when 'Delete Asset' is clicked from the dropdown
document.getElementById('delete-asset-anchor').addEventListener('click', function(){
    setDeleteFormState();
});


// 'DELETE' STATE
//      Put manage asset form into the 'delete' state
function setDeleteFormState() {
    // Make sure the form is clear of input
    document.getElementById('manage-asset-form').reset();

    // Set the header of the modal
    document.getElementById('staticBackdropLabel').innerText = 'Delete Asset';

    // Set the submit button text
    document.getElementById('asset-submit-button').value = 'Delete Asset';

    // Set the form state so the submit button knows what to do
    document.getElementById('form-state').value = 'delete';

    // Make sure only the id input is enabled
    disableAssetForm(true);
    document.getElementById('asset-id-input').disabled = false;

    // Require only the asset id
    requireAllFromAssetForm(false);
    document.getElementById('asset-id-input').required = false;
}


// ID ADDED -> FILLED IN 'UPDATE' STATE
//          -> FILLED IN 'DELETE' STATE
//      Change the 'update' state of the asset if a valid id is entered in the form
//      Fill in and enable all the inputs
document.getElementById('asset-id-input').addEventListener('focusout', function(event){
    let state = document.getElementById('form-state').value;

    let id = document.getElementById('asset-id-input').value;
    let rowToUpdate = findRowByAssetId(id);

    if(state == 'update'){

        if(rowToUpdate != null){
            fillAssetFormFromRow(rowToUpdate);
            disableAssetForm(false);
        }
        else{
            setUpdateFormState();
            alert('Unable to find matching ID');
        }

    } else if(state == 'delete') {
    
        if(rowToUpdate != null){
            fillAssetFormFromRow(rowToUpdate);
            document.getElementById('asset-submit-button').disabled = false;
        }
        else{
            setDeleteFormState();
            alert('Unable to find matching ID');
        }

    }
});




// DISABLE/ENABLE FORM
//      Set the disabled attribute of all form elements to the same thing
//      If shouldDisable = true, everything is disabled.  If false, everything is enabled.
function disableAssetForm(shouldDisable){
    document.getElementById('asset-id-input').disabled = shouldDisable;
    document.getElementById('title-input').disabled = shouldDisable;
    document.getElementById('author-input').disabled = shouldDisable;
    document.getElementById('media-type-input').disabled = shouldDisable;
    document.getElementById('language-input').disabled = shouldDisable;
    document.getElementById('collection-input').disabled = shouldDisable;
    document.getElementById('location-input').disabled = shouldDisable;
    document.getElementById('loan-type-input').disabled = shouldDisable;
    document.getElementById('inter-lib-loan-input').disabled = shouldDisable;
    document.getElementById('asset-submit-button').disabled = shouldDisable;
}




// REQUIRE ALL FORM INPUTS
//      Set the required attribute of all form elements to the same thing
//      If shouldRequire = true, everything is require.  If false, nothing is required.
function requireAllFromAssetForm(shouldRequire){
    document.getElementById('asset-id-input').required = shouldRequire;
    document.getElementById('title-input').required = shouldRequire;
    document.getElementById('author-input').required = shouldRequire;
    document.getElementById('media-type-input').required = shouldRequire;
    document.getElementById('language-input').required = shouldRequire;
    document.getElementById('collection-input').required = shouldRequire;
    document.getElementById('location-input').required = shouldRequire;
    document.getElementById('loan-type-input').required = shouldRequire;
}



// ROW DATA -> FORM VALUES
//      Fill in the form values based on the given row of the asset table
function fillAssetFormFromRow(rowData){
    let data = rowData.children;

    document.getElementById('asset-id-input').value = data[1].innerText;
    document.getElementById('title-input').value = data[2].innerText;
    document.getElementById('author-input').value = data[3].innerText;
    document.getElementById('media-type-input').value = data[4].innerText;
    document.getElementById('language-input').value = data[5].innerText;
    document.getElementById('collection-input').value = data[6].innerText;
    document.getElementById('location-input').value = data[7].innerText;
    document.getElementById('loan-type-input').value = data[8].innerText;
    document.getElementById('inter-lib-loan-input').checked = (data[9].innerText == 'Yes'); 
}



/* ********************************************************* */

// OTHER
//   Assorted helper functions

/* ********************************************************* */


// FIND BY ID
//      Search the table for the row element corresponding to a given id.
//      Returns the row if one is found, null otherwise
function findRowByAssetId(id){
    allRows = document.getElementById('asset-list-body').children;

    if( allRows.length <= 0 ){
        console.log('No rows found in table body');
        return null;
    }

    for(let i=0; i < allRows.length; i++){
        let data = allRows[i].children;
        if(data[1].innerText == id)
            return allRows[i];
    }

    console.log('No row found matching id ' + id);
    return null;
}


// FORM DATA -> LIBRARY ASSET
//      grab the data from the form, add it to a library asset object, and return the object
function getAssetFormData(){
    // Retrieve data from the Manage Asset form
    var newAssetId = document.getElementById('asset-id-input').value;
    var newTitle = document.getElementById('title-input').value;
    var newAuthor = document.getElementById('author-input').value;
    var newMediaType = document.getElementById('media-type-input').value;
    var newLanguage = document.getElementById('language-input').value;
    var newCollection = document.getElementById('collection-input').value;
    var newLocation = document.getElementById('location-input').value;
    var newLoanType = document.getElementById('loan-type-input').value;
    var newInterLibLoan = document.getElementById('inter-lib-loan-input').checked;

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

    return libAsset;
}