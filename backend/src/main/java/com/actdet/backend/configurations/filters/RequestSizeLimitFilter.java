package com.actdet.backend.configurations.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class RequestSizeLimitFilter extends OncePerRequestFilter {

    private static final long MAX_REQUEST_SIZE = 30L*1024*1024;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        long contentLength = request.getContentLengthLong();
        if(contentLength>MAX_REQUEST_SIZE){
            response.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
            response.getWriter().write("");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
