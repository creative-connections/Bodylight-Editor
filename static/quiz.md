# Quiz
```html
<bdl-quiz question="Question :" 
          answers="answer 1 (separated by pipe) | answer 2"
          correctoptions="false|true"
          explanations="explanation why answer 1 is false (separated by pipe)|explanation why answer 2 is true">
</bdl-quiz>
```
Creates a quiz component, 
  * question - any text
  * answers - multiple options separated by pipe '|' character
  * correctoptions - set of `true`,`false` in the same order of answers separated by pipe '|' character
  * explanations - set of multiple explanation separated by pipe '|', explanation is shown when a <button>Submit</button> is clicked by user.
   
<bdl-quiz question="Question :" 
          answers="answer 1 (separated by pipe) | answer 2"
          correctoptions="false|true"
          explanations="explanation why answer 1 is false (separated by pipe)|explanation why answer 2 is true">
</bdl-quiz>
