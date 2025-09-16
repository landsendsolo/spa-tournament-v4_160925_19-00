#!/bin/bash

# Define the output file
OUTPUT_FILE="file_data.txt"

# Check if output file is writable
if ! touch "$OUTPUT_FILE" 2>/dev/null; then
    echo "Error: Cannot write to $OUTPUT_FILE" >&2
    exit 1
fi

# Clear the output file
> "$OUTPUT_FILE"

# Function to append file content with a header
append_file() {
    local file_path="$1"
    if [ -f "$file_path" ]; then
        echo "----- Contents of $file_path -----" >> "$OUTPUT_FILE"
        cat "$file_path" >> "$OUTPUT_FILE"
        # Only add newline if file doesn't end with one
        if [ -n "$(tail -c 1 "$file_path")" ]; then
            echo >> "$OUTPUT_FILE"
        fi
    else
        echo "----- $file_path not found -----" >> "$OUTPUT_FILE"
    fi
}

# List of file patterns to gather
FILES=(
    "src/app/draw/page.tsx"
    "src/app/matches/page.tsx"
    "src/components/bracket"
    "src/components/matches"
    "src/components/scoring"
    "src/app/globals.css"
    "src/components/theme-provider.tsx"
)

# Gather contents of each file or directory
for pattern in "${FILES[@]}"; do
    if [[ "$pattern" == *"/*" ]]; then
        # Handle directories with wildcard
        dir="${pattern%/*}"
        if [ -d "$dir" ]; then
            for f in "$dir"/*.tsx; do
                [ -f "$f" ] && append_file "$f"
            done
        else
            echo "----- Directory $dir not found -----" >> "$OUTPUT_FILE"
        fi
    else
        append_file "$pattern"
    fi
done

echo "File data has been saved to $OUTPUT_FILE"
