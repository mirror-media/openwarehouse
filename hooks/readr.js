import React from 'react'
import K5Logo from './components/K5Logo/K5Logo'
export default {
    pages: () => [
        {
            label: 'Content',
            children: [
                'Post',
                'EditorChoice',
                'Feature',
                'Collaboration',
                'Project',
                'Quote',
                'Data',
                'Gallery',
                'Image',
                'Video',
                'Audio',
            ],
        },
        {
            label: 'Class',
            children: ['Category', 'Tag'],
        },
        {
            label: 'People',
            children: ['User', 'Author'],
        },
    ],
    logo: () => <K5Logo />,
}
