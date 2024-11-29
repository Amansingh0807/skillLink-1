import React, { useEffect, useState } from "react";
import "./CommunityTab.scss";
import axios from "axios";

const CommunityTab = () => {
  const [newQuestion, setNewQuestion] = useState("");

  const [questions, setQuestions] = useState([]);

async function getPost() {
  try {
    const response = await axios.get("https://skilllink.onrender.com/api/v1/user/post/all-posts", {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    const posts = response.data.post;

  
    const formattedQuestions = posts.map((post) => ({
      id: post.id.toString(),
      question: post.desc,
      answers: (post.comment || []).map((comment) => ({
        id: `${post.id}`, 
        text: comment.desc,
        upvotes: 0,
        downvotes: 0,
      })),
    }));

    setQuestions(formattedQuestions);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}


  const addQuestion = async () => {
    if (newQuestion.trim()) {
      try {
        const response = await axios.post("https://skilllink.onrender.com/api/v1/user/post/add", {
          desc: newQuestion,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        setQuestions([...questions, response.data]);
        setNewQuestion("");
      } catch (error) {
        console.error("Error adding question:", error);
      }
    }
  };


  const addAnswer = async (postId, answer) => {
    try {
      const response = await axios.post(`https://skilllink.onrender.com/api/v1/user/post/addcomment`, {
        desc: answer.toString(),
        postId: Number(postId),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setQuestions(
        questions.map((q) =>
          q.id === postId
            ? {
              ...q,
              answers: [...q.answers, response.data],
            }
            : q
        )
      );
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };


  const updateVotes = (questionId, answerId, type) => {
    const voteKey = `${questionId}-${answerId}`;
    const votedAnswers = JSON.parse(localStorage.getItem("votedAnswers")) || {};

    if (votedAnswers[voteKey]) {
      alert("You have already voted on this answer!");
      return;
    }

    // Mark as voted
    votedAnswers[voteKey] = true;
    localStorage.setItem("votedAnswers", JSON.stringify(votedAnswers));

    // Update votes
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId
                ? {
                  ...a,
                  upvotes: type === "upvote" ? a.upvotes + 1 : a.upvotes,
                  downvotes: type === "downvote" ? a.downvotes + 1 : a.downvotes,
                }
                : a
            ),
          }
          : q
      )
    );
  };

  const shareAnswer = (answerText) => {
    navigator.clipboard.writeText(answerText);
    alert("Answer copied to clipboard for sharing!");
  };
  useEffect(() => {
    getPost();
  }, []);
  return (

    <div className="community-tab">
      <div className="side-bar left">
        <ul>
          <li>Web Development</li>
          <li>AI Engineer</li>
          <li>Web3</li>
          <li>Copywriting</li>
          <li>WordPress</li>
          <li>Machine Learning</li>
          <li>Blockchain</li>
          <li>SEO</li>
          <li>Data Science</li>
          <li>UI/UX Design</li>
        </ul>
      </div>

      <div className="main-content">
        <h1 className="header">Ask your Queries</h1>


        <div className="question-box">
          <input
            type="text"
            placeholder="Ask a question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button onClick={addQuestion}>Post</button>
        </div>


        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <h3>{q.question}</h3>
            <AnswerList
              questionId={q.id}
              answers={q.answers}
              addAnswer={addAnswer}
              updateVotes={updateVotes}
              shareAnswer={shareAnswer}
            />
          </div>
        ))}
      </div>

      <div className="side-bar right">
        <h4>Related Questions</h4>
        <ul>
          <li>What are the best tools for web development?</li>
          <li>How to start freelancing as a web designer?</li>
          <li>What skills are needed for a successful AI career?</li>
          <li>How to get clients for tech freelancing?</li>
          <li>Best practices for developing Web3 apps.</li>
        </ul>
      </div>
    </div>
  );
};

const AnswerList = ({ questionId, answers, addAnswer, updateVotes, shareAnswer }) => {
  const [newAnswer, setNewAnswer] = useState("");
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const submitAnswer = () => {
    addAnswer(questionId, newAnswer);
    setNewAnswer("");
  };

  const toggleAnswers = () => {
    setShowAllAnswers((prev) => !prev);
  };

  const displayedAnswers = showAllAnswers ? answers : answers.slice(0, 3);

  return (
    <div>
      <div className="answer-box">
        <input
          type="text"
          placeholder="Write an answer..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button onClick={submitAnswer}>Submit</button>
      </div>

      <div className="answers">
        {displayedAnswers.map((a) => (
          <div key={a.id} className="answer-card">
            <p>{a.text}</p>
            <div className="answer-actions">
              <button onClick={() => updateVotes(questionId, a.id, "upvote")}>
                👍 {a.upvotes}
              </button>
              <button onClick={() => updateVotes(questionId, a.id, "downvote")}>
                👎 {a.downvotes}
              </button>
              <button onClick={() => shareAnswer(a.text)}>🔗 Share</button>
            </div>
          </div>
        ))}
      </div>

      {answers.length > 3 && (
        <button onClick={toggleAnswers} className="toggle-answers">
          {showAllAnswers ? "Show Less" : "See More Answers"}
        </button>
      )}
    </div>
  );
};

export default CommunityTab;
