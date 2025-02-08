#!/bin/bash

# Define the name of the output zip file
output_zip="app.zip"

# Get the name of the script itself
script_name=$(basename "$0")

# Create the zip file, excluding .git directory, the output zip file, and the script itself
zip -r "$output_zip" . -x ".git/*" "$output_zip" "$script_name"

# Check if the zip command was successful
if [ $? -eq 0 ]; then
    echo "Zip file created successfully: $output_zip"
else
    echo "Failed to create zip file."
fi