package com.actdet.backend.configurations.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class TwoFactorAuthFilter extends OncePerRequestFilter {

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith(contextPath+"/auth/") || path.startsWith(contextPath+"/actuator") || path.equals(contextPath+"/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        HttpSession session = request.getSession(false);
        boolean is2faAuthenticated = session != null && Boolean.TRUE.equals(session.getAttribute("2FA_AUTHENTICATED"));

        if (!is2faAuthenticated) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("2FA_REQUIRED");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
