# X For You Feed Algorithm — Notes (from xai-org/x-algorithm)

This folder captures a **high-level technical summary** of the open-source repo:
https://github.com/xai-org/x-algorithm

## Core pipeline (as described in the repo)

The system powering the **For You** feed is an orchestration pipeline that:

1) hydrates user context
2) sources candidates from multiple systems
3) hydrates candidates (post + author + entities)
4) filters ineligible content
5) scores + ranks candidates using ML predictions
6) applies post-selection filters

### Candidate sources

- **Thunder (in-network):** fast store of recent posts from accounts you follow.
- **Phoenix Retrieval (out-of-network):** ML similarity retrieval (two-tower embeddings) across global corpus.

### Scoring

- **Phoenix Scorer:** Grok-based transformer predicts probabilities of multiple actions (like/reply/repost/click/dwell/etc), plus negative feedback actions.
- **Weighted Scorer:** combines predicted action probabilities into a single score:

`Final Score = Σ (weight_i × P(action_i))`

- Additional adjustments exist (e.g., author diversity attenuation, OON adjustments).

### Filtering

Filtering happens **pre-scoring** and **post-selection** (visibility + safety + dedupe).

## What this means for “going viral” (practical translation)

The repo describes *how posts are ranked*; it does **not** publish secret numeric thresholds for “viral takeoff”.

From the architecture, the strongest practical implications are:

- **Velocity matters** because engagement probabilities (and downstream re-ranking) respond to fast-changing feedback signals.
- **Multi-objective scoring** means “viral” is not just likes: replies, reposts, dwell, clicks, and negative feedback all contribute.
- **Candidate sourcing matters**: a post must be *retrieved* before it can be scored; different retrieval paths (in-network vs OON) change your early distribution.
- **Diversity + dedupe rules** can cap runaway repetition from one author or one conversation.

## Repo terms you’ll see

- **Home Mixer:** orchestration layer
- **CandidatePipeline:** framework of Source/Hydrator/Filter/Scorer/Selector
- **Thunder:** in-network candidate source
- **Phoenix Retrieval:** out-of-network retrieval
- **Phoenix Scorer:** transformer scoring

## Source
Open-source text excerpted/summarized from the repository README and docs.
