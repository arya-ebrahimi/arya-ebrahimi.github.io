---
layout: post
title: "Fuzzy Tiling Activations"
author: arya
categories: 
tags: 
image: /assets/img/fta/FTA.png
math: true
---
----
## Introduction

In the realm of artificial intelligence and machine learning, the pursuit of developing intelligent systems that can adapt and learn from new information resembles the human capacity for continuous learning. However, a challenge known as catastrophic interference [[1]](#1) emerges as a critical hurdle on this path. Catastrophic interference occurs when the integration of new information disrupts or erases previously learned knowledge. Understanding and mitigating catastrophic interference is an essential pursuit, as it holds the key to creating resilient, lifelong learning systems that can flexibly acquire and retain knowledge across diverse tasks. 

Recent studies suggest that sparse representations can mitigate catastrophic interference \[[2](#2), [3](#3)], which arises due to the overwriting of shared network parameters when learning new tasks, which results in the loss of previously learned information. Sparse representations involve the concept of selective activation, where only a subset of neurons or features is activated for a specific task. This can alleviate catastrophic interference by limiting the extent to which new information encroaches upon existing knowledge.

[[3]](#3) proposes a new approach called Online aware Meta-learning (OML), which aims to minimize interference and promote future learning by learning sparse representations that are robust and suitable for online updating in continual learning. The authors propose a meta-objective called OML that uses catastrophic interference as a training signal. They optimize the objective using gradient-based meta-learning algorithms and show that it is effective in learning representations that are more suitable for online updating in sequential regression and classification problems.

This approach encodes sparsity in the meta-learner's objective and loss function. However, another approach could be to achieve sparsity by design, or as it is referred to in Fuzzy Tiling Activations, **natural sparsity**, which we are going to talk about in this blog post.

## Tiling Activations
Before introducing FTA, let's learn about a simpler version called Tiling Activation, which is the binning mechanism of FTA without smoothing.
This Tiling Activation takes a scalar $z$ as input and outputs a binned vector with a value of 1 in bin corresponding to $z$ and zeros elsewhere, which is somewhat similar to one-hot encoding.

<!-- <p align="center">
  <img src="/assets/img/fta/fta1.png"/>
  <em> Tiling activation output for k=4</em>
</p> -->
![](/assets/img/fta/fta1.png)
*Tiling activation output for k=4*

## References
<a name="1">[1]</a> McCloskey, M., & Cohen, N. J. (1989, January 1). Catastrophic Interference in Connectionist Networks: The Sequential Learning Problem (G. H. Bower, Ed.). ScienceDirect; Academic Press. https://www.sciencedirect.com/science/article/abs/pii/S0079742108605368?via%3Dihub

<a name="2">[2]</a> Liu, V., Kumaraswamy, R., Le, L., & White, M. (2018, November 15). The Utility of Sparse Representations for Control in Reinforcement Learning. ArXiv.org. https://doi.org/10.48550/arXiv.1811.06626

‌<a name="3">[3]</a> Javed, K., & White, M. (n.d.). Meta-Learning Representations for Continual Learning. Retrieved August 20, 2023, from https://arxiv.org/pdf/1905.12588.pdf

‌<a name="4">[4]</a> Pan, Y., Banman, K., & White, M. (n.d.). Published as a conference paper at ICLR 2021 FUZZY TILING ACTIVATIONS: A SIMPLE APPROACH TO LEARNING SPARSE REPRESENTATIONS ONLINE. Retrieved August 20, 2023, from https://arxiv.org/pdf/1911.08068v3.pdf

‌

‌

