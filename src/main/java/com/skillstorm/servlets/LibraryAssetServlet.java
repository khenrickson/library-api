package com.skillstorm.servlets;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstorm.beans.LibraryAsset;
import com.skillstorm.data.LibraryAssetDAO;

@WebServlet(urlPatterns = {"/api/library-asset"})
public class LibraryAssetServlet extends HttpServlet{
	
	LibraryAssetDAO dao = new LibraryAssetDAO();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		System.out.println("AssetEditorServlet GET()");
		
		LinkedList<LibraryAsset> allAssets = dao.findAll();
		
		String json = new ObjectMapper().writeValueAsString(allAssets);
		
		resp.getWriter().print(json);
		resp.setContentType("application/json");
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		InputStream requestBody = req.getInputStream();
		LibraryAsset newAsset = new ObjectMapper().readValue(requestBody, LibraryAsset.class);

		LibraryAsset updatedAsset = dao.create(newAsset);

		resp.getWriter().print(new ObjectMapper().writeValueAsString(updatedAsset));
			
		resp.setStatus(201);
		resp.setContentType("application/json");
			
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		InputStream requestBody = req.getInputStream();
		LibraryAsset updateAsset = new ObjectMapper().readValue(requestBody, LibraryAsset.class);

		if(dao.update(updateAsset)) {
			resp.setStatus(204);
		} else {
			resp.setStatus(500);
		}

	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		InputStream requestBody = req.getInputStream();
		LibraryAsset updateAsset = new ObjectMapper().readValue(requestBody, LibraryAsset.class);

		if(dao.delete(updateAsset)) {
			resp.setStatus(204);
		} else {
			resp.setStatus(500);
		}
	}
}
