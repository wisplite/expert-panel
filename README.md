### Expert Panel
Expert Panel is an experiment to test if the quality of responses from LLMs improves if multiple models are given an open-ended chatroom to discuss the question and share expertise.

The thinking is that this will act like an assisted CoT of sorts, where increased latency is traded for better quality responses.

The currrent plan for this loop is as follows:
1. User asks question
2. Question is passed to an initial model, which initiates the conversation
3. Other models jump in and share thoughts on the topic
4. Models vote on which model should provide the final response based on the quality of their responses
5. The chosen model uses its expertise and information learned from the conversation to provide the best quality response possible.

I am hoping this will also be an interesting test in the flexability and adaptivity of these models. For example, giving tools to only one or two models and seeing if the larger models catch on and work with the other models for their tool access.
