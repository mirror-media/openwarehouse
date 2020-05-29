export default {
    pages: () => [
        {
            label: 'Content',
            children: ['Post', 'Image', 'Video', 'Audio'],
        },
        {
            label: 'Classification',
            children: ['Topic', 'Section', 'PostCategory', 'Tag'],
        },
        {
            label: 'People',
            children: ['User', 'Contact'],
        },
    ]
};
