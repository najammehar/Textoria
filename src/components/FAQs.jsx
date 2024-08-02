import React from 'react';

const FAQs = () => {
  const faqs = [
    {
      question: "Can I read posts without creating an account?",
      answer: "No, you must sign up or log in to view posts on our website."
    },
    {
      question: "How do I switch between dark mode and light mode?",
      answer: "You can toggle between dark mode and light mode by clicking the mode switch button located at the Sidebar or burger menu on small devices."
    },
    {
      question: "What information can I add to my profile?",
      answer: "In your profile, you can add a profile picture, a brief about section. You can also view the total number of posts and likes you have received."
    },
    {
      question: "How do I publish a post?",
      answer: "After logging in, click the 'Write' button, write your content, and click 'Publish' to share it with others."
    },
    {
      question: "Can I edit or delete my posts?",
      answer: "Yes, as the author, you can edit or delete your posts at any time from your profile or the post's page."
    },
    {
      question: "What happens to the likes if I delete a post?",
      answer: "If you delete a post, its likes are also deleted. If you want to keep the likes, you can set the post status to private instead."
    },
    {
      question: "How do I like, read, and share a post?",
      answer: "To like a post, click the 'Like' button below it. To read a post, simply click on its title. To share a post, use the share option."
    },
    {
      question: "Can other users see my profile?",
      answer: "Yes, other users can see your profile, including your picture, about section, total number of posts, and total likes."
    },
    {
      question: "What should I do if I encounter a problem on the website?",
      answer: "If you encounter any issues, please contact our support team via email at najamulhassan1033@gmail.com."
    }
  ];

  return (
    <div className="text-grey-5 p-8">
      <div className="space-y-4">
        <h1 className='text-2xl font-bold text-purple-60'>Fequently Asked Question</h1>
        {faqs.map((faq, index) => (
          <div key={index} className="p-4">
            <h2 className="text-xl font-semibold dark:text-white">{faq.question}</h2>
            <p className="text-grey-45 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
