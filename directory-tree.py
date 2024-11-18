#!/usr/bin/env python3
"""
Directory Tree Generator
Creates a text file containing a tree representation of the current directory structure.
"""

import os
from pathlib import Path
from datetime import datetime

class DirectoryTreeGenerator:
    def __init__(self, root_dir='.', output_file='directory_tree.txt', ignore_dirs=None, ignore_files=None):
        """
        Initialize the DirectoryTreeGenerator.
        
        Args:
            root_dir (str): Starting directory path (default: current directory)
            output_file (str): Name of the output file
            ignore_dirs (list): List of directory names to ignore
            ignore_files (list): List of file names or patterns to ignore
        """
        self.root_dir = Path(root_dir)
        self.output_file = output_file
        self.ignore_dirs = set(ignore_dirs or ['.git', '__pycache__', 'node_modules', '.venv'])
        self.ignore_files = set(ignore_files or ['.DS_Store', '*.pyc', '*.pyo', '*.pyd', '.env'])
        self.tree_content = []

    def should_ignore(self, path):
        """Check if the path should be ignored based on ignore patterns."""
        name = path.name
        if path.is_dir() and name in self.ignore_dirs:
            return True
        if path.is_file():
            return any(
                name == ignore_pattern or 
                (ignore_pattern.startswith('*.') and name.endswith(ignore_pattern[1:]))
                for ignore_pattern in self.ignore_files
            )
        return False

    def generate_tree(self, directory=None, prefix=""):
        """
        Recursively generate the directory tree structure.
        
        Args:
            directory (Path): Current directory being processed
            prefix (str): Prefix for the current line (used for formatting)
        """
        if directory is None:
            directory = self.root_dir

        # Add directory name
        if directory == self.root_dir:
            self.tree_content.append(str(directory.resolve()))
        
        # Get and sort directory contents
        try:
            entries = sorted(
                [entry for entry in directory.iterdir() if not self.should_ignore(entry)],
                key=lambda x: (x.is_file(), x.name.lower())
            )
        except PermissionError:
            self.tree_content.append(f"{prefix}└── [Permission Denied]")
            return

        # Process each entry
        for i, entry in enumerate(entries):
            is_last = i == len(entries) - 1
            connector = "└── " if is_last else "├── "
            
            self.tree_content.append(f"{prefix}{connector}{entry.name}")
            
            if entry.is_dir():
                new_prefix = prefix + ("    " if is_last else "│   ")
                self.generate_tree(entry, new_prefix)

    def save_tree(self):
        """Save the generated tree to a file with timestamp."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        header = [
            "Directory Tree",
            f"Generated: {timestamp}",
            "=" * 50,
            ""
        ]
        
        try:
            with open(self.output_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(header + self.tree_content))
            print(f"Directory tree has been saved to {self.output_file}")
        except Exception as e:
            print(f"Error saving file: {e}")

def main():
    """Main function to run the directory tree generator."""
    # You can customize these default settings
    settings = {
        'root_dir': '.',  # Current directory
        'output_file': 'directory_tree.txt',
        'ignore_dirs': ['.git', '__pycache__', 'node_modules', '.venv'],
        'ignore_files': ['.DS_Store', '*.pyc', '*.pyo', '*.pyd', '.env']
    }

    try:
        tree_generator = DirectoryTreeGenerator(**settings)
        tree_generator.generate_tree()
        tree_generator.save_tree()
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
