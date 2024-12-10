import React from "react";

interface QuestionCategoriesProps {
  categoryColors: { [key: string]: string };
  difficulties: string[];
  answeredQuestions: { [key: string]: Set<string> };
  getCategoryQuestions: (category: string) => any[];
}

const QuestionCategories: React.FC<QuestionCategoriesProps> = ({
  categoryColors,
  difficulties,
  answeredQuestions,
  getCategoryQuestions,
}) => {
  const renderQuestionSquares = (category: string, difficulty: string) => {
    const categoryQuestions = getCategoryQuestions(category).filter(
      (q) => q.difficulty === difficulty
    );
    const answeredCategoryQuestions = categoryQuestions.filter((q) =>
      answeredQuestions[`${category}-${difficulty}`]?.has(String(q.id))
    );
    return (
      <div className="question-squares">
        {categoryQuestions.map((q, index) => (
          <span
            key={index}
            className={`question-square ${
              answeredCategoryQuestions.includes(q) ? "answered" : ""
            }`}
            style={{ backgroundColor: categoryColors[category] }}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <div className="question-category-stats">
      <div className="question-category-list">
        {Object.keys(categoryColors).map((category) => (
          <div key={category} className="category">
            <h4>{category}</h4>
            {difficulties.map((difficulty) => (
              <div key={difficulty} className="difficulty">
                {renderQuestionSquares(category, difficulty)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCategories;
