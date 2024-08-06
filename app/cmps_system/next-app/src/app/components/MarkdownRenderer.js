import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ filePath }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(filePath)
            .then((response) => response.text())
            .then((text) => setContent(text));
    }, [filePath]);

    const CustomHeading = ({ level, children }) => {
        const text = React.Children.toArray(children).reduce((text, child) => typeof child === 'string' ? text + child : text, '');
        const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
        const HeadingTag = `h${level}`;

        return <HeadingTag id={slug}>{children}</HeadingTag>;
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ node, ...props }) => <CustomHeading level={1} {...props} />,
                h2: ({ node, ...props }) => <CustomHeading level={2} {...props} />,
                h3: ({ node, ...props }) => <CustomHeading level={3} {...props} />,
                h4: ({ node, ...props }) => <CustomHeading level={4} {...props} />,
                h5: ({ node, ...props }) => <CustomHeading level={5} {...props} />,
                h6: ({ node, ...props }) => <CustomHeading level={6} {...props} />
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
