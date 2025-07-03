FROM httpd:latest
LABEL authors="ian.patterson"

# Copy built frontend files from dist to Apache's default web root
COPY dist /usr/local/apache2/htdocs

EXPOSE 80

# Start Apache in the foreground (default CMD)
