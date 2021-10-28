package com.skillstorm.beans;

import java.util.Objects;

public class LibraryAsset {

	private int assetId;			// The id of the library asset.  Should be positive.
									// -1 indicates that no id is assigned from the database.
	private String title;
	private String author;
	private String mediaType;		
	private String language;
	private String collection;		// This is the collection in which the asset can be found.
	private String location;		// The library that owns/houses the asset
	private String loanType;		// Describes the duration of and access needed for a loan
	private boolean interLibLoan;	// True means the asset may be loaned between libraries

	
	
	public LibraryAsset() {
		super();
		this.assetId = -1;
	}
	
	public LibraryAsset(String title, String author, String mediaType, String collection, String location,
			String loanType, boolean interLibLoan) {
		super();
		this.assetId = -1;
		this.title = title;
		this.author = author;
		this.mediaType = mediaType;
		this.language = "English";
		this.collection = collection;
		this.location = location;
		this.loanType = loanType;
		this.interLibLoan = interLibLoan;
	}

	public LibraryAsset(String title, String author, String mediaType, String language, String collection,
			String location, String loanType, boolean interLibLoan) {
		super();
		this.assetId = -1;
		this.title = title;
		this.author = author;
		this.mediaType = mediaType;
		this.language = language;
		this.collection = collection;
		this.location = location;
		this.loanType = loanType;
		this.interLibLoan = interLibLoan;
	}

	public LibraryAsset(int assetId, String title, String author, String mediaType, String language, String collection,
			String location, String loanType, boolean interLibLoan) {
		super();
		this.assetId = assetId;
		this.title = title;
		this.author = author;
		this.mediaType = mediaType;
		this.language = language;
		this.collection = collection;
		this.location = location;
		this.loanType = loanType;
		this.interLibLoan = interLibLoan;
	}


	
	
	public int getAssetId() {
		return assetId;
	}

	public void setAsset_id(int assetId) {
		this.assetId = assetId;
	}
	

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}
	

	public String getMediaType() {
		return mediaType;
	}

	public void setMediaType(String mediaType) {
		this.mediaType = mediaType;
	}

	
	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}


	public String getCollection() {
		return collection;
	}

	public void setCollection(String collection) {
		this.collection = collection;
	}


	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}


	public String getLoanType() {
		return loanType;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}


	public boolean isInterLibLoan() {
		return interLibLoan;
	}

	public void setInterLibLoan(boolean interLibLoan) {
		this.interLibLoan = interLibLoan;
	}


	
	
	@Override
	public int hashCode() {
		return Objects.hash(assetId, author, collection, interLibLoan, language, loanType, location, mediaType, title);
	}
	

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		LibraryAsset other = (LibraryAsset) obj;
		return assetId == other.assetId && Objects.equals(author, other.author)
				&& Objects.equals(collection, other.collection) && interLibLoan == other.interLibLoan
				&& Objects.equals(language, other.language) && Objects.equals(loanType, other.loanType)
				&& Objects.equals(location, other.location) && Objects.equals(mediaType, other.mediaType)
				&& Objects.equals(title, other.title);
	}


	
	
	@Override
	public String toString() {
		return "LibraryAsset [assetId=" + assetId + ", title=" + title + ", author=" + author + ", mediaType="
				+ mediaType + ", language=" + language + ", collection=" + collection + ", location=" + location
				+ ", loanType=" + loanType + ", interLibLoan=" + interLibLoan + "]";
	}

	
}
