---
layout: post
title: "Offline Meta-Reinforcement Learning"
author: arya
categories: [Reinforcement Learning]
tags: [rl, meta-learning]
image: /assets/img/eddie/obot.png
math: true
---
----
## Abstract
In recent years, reinforcement learning has witnessed substantial progress in domains such as robotics and Atari game-playing. Nevertheless, challenges related to data inefficiency and limited generalization capabilities have hindered further advancements in this field. Meta-reinforcement learning methods offer a promising solution by enabling policies to adapt to new tasks with fewer data samples compared to standard RL techniques. However, the meta-training phase itself demands a substantial amount of data and is costly. The incorporation of offline data into this process holds the potential to mitigate data inefficiency issues, yet it introduces its own set of complexities. In this review, we introduce various categories of offline meta-reinforcement learning approaches and provide an overview of relevant research papers within each category, facilitating a deeper understanding of this field.

## Introduction
Meta-reinforcement learning refers to a group of machine learning techniques designed to acquire the ability to learn reinforcement learning itself. These methods have the potential to overcome the sample inefficiency of reinforcement learning methods during meta-test time. However, since these methods are trained on a distribution of similar tasks during meta-training, they require a greater amount of data, which implies that meta-training itself is sample inefficient but meta-testing is sample efficient [[1]](#1).

Since meta-training requires a larger amount of data, online learning is not practical, and it could even be impossible in some cases since interaction with the environment may not be possible. Utilizing offline data in this situation could be a practical choice because the data is precollected and can alleviate the sample inefficiency problem.

However, offline reinforcement learning itself poses difficulties. The policy under which the offline data is collected ($\pi_b$) differs from the current learning policy ($\pi_{\theta}$), resulting in a discrepancy between the distributions of these two policies (distributional shift) [[2]](#2). This can be problematic when the agent selects an action that is not defined in $\pi_b$. In online learning, by interacting with the environment, the agent can rectify this difference; however, in offline settings, this difference cannot be overcome. Nonetheless, offline meta-reinforcement learning presents additional problems, the most important of which is that the distribution of trajectories seen by the agent during meta-testing and meta-training differs. However, within recent years, many approaches have been introduced to address this problem, which I introduce some of them in this literature review.



## References
<a name="1">[1]</a>  J. Beck et al., “A survey of meta-reinforcement learning,” arXiv preprint arXiv:2301.08028, 2023.

<a name="2">[2]</a> S. Levine, A. Kumar, G. Tucker, and J. Fu, “Offline reinforcement learning: Tutorial, review, and perspectives on open problems,” arXiv preprint arXiv:2005.01643, 2020.

<a name="3">[3]</a> T. Yu et al., “Meta-world: A benchmark and evaluation for multi-task and meta reinforcement learning,” in Conference on robot learning, PMLR, 2020, pp. 1094–1100.

<a name="4">[4]</a> C. Finn, P. Abbeel, and S. Levine, “Model-agnostic meta-learning for fast adaptation of deep networks,” in International conference on machine learning, PMLR, 2017, pp. 11261135.

<a name="5">[5]</a> X. B. Peng, A. Kumar, G. Zhang, and S. Levine, “Advantage-weighted regression: Simple and scalable off-policy reinforcement learning,” arXiv preprint arXiv:1910.00177, 2019.

<a name="6">[6]</a> E. Mitchell, R. Rafailov, X. B. Peng, S. Levine, and C. Finn, “Offline meta-reinforcement learning with advantage weighting,” in International Conference on Machine Learning, PMLR, 2021, pp. 7780–7791.

<a name="7">[7]</a> C. Finn, “Learning to learn with gradients,” Ph.D. dissertation, EECS Department, University of California, Berkeley, Aug. 2018.

<a name="8">[8]</a> V. H. Pong, A. V. Nair, L. M. Smith, C. Huang, and S. Levine, “Offline meta-reinforcement learning with online self-supervision,” in International Conference on Machine Learning, PMLR, 2022, pp. 17 811–17 829.

<a name="9">[9]</a> S. Lee and S.-Y. Chung, “Improving generalization in meta-rl with imaginary tasks from latent dynamics mixture,” Advances in Neural Information Processing Systems, vol. 34, pp. 27 222–27 235, 2021.

<a name="10">[10]</a> H. Yuan and Z. Lu, “Robust task representations for offline meta-reinforcement learning via contrastive learning,” in International Conference on Machine Learning, PMLR, 2022, pp. 25 747–25 759.

<a name="11">[11]</a> 
Y. Mu et al., “Decomposed mutual information optimization for generalized context in meta-reinforcement learning,” arXiv preprint arXiv:2210.04209, 2022.


The pdf of the report is also available:
<object data="/assets/img/offmetarl/main.pdf" type="application/pdf" width="850px" height="850px">
    <embed src="/assets/img/eddie/main.pdf">
        <p>This browser does not support PDFs.</p>
    </embed>
</object>