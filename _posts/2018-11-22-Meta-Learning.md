---
layout: post
title: Meta Learning
categories: Blog
description: Meta Learning Tutorial
keywords: Meta learning
---

### 学术热潮趋势
人工智能=> 机器学习 => 深度学习=> 深度强化学习=> 元学习

元学习，Learning to learn,意在教会算法自己学会如何学习，这是一个通往通用人工智能的关键一步，概念很火但是

### 元学习概念


### 现状
> xxx

#### 方法
1、基于记忆Memory的方法。 
基本思路：因为要通过以往的经验来学习，那就可以通过在神经网络中添加Memory来实验。

2、基于预测梯度的方法。 
基本思路：Meta Learning的目的是实现快速学习，而实现快速学习的关键点是神经网络的梯度下降要准和快，那么就可以让神经网络利用以往的任务学习如何预测梯度，这样面对新的任务，只要梯度预测的准，那么学习就会快。

3、利用Attention注意力机制 
基本思路：训练一个Attention模型，在面对新任务时，能够直接的关注最重要部分。

4、借鉴LSTM的方法 
基本思路：LSTM内部的更新非常类似于梯度下降的更新，那么能否利用LSTM的结构训练处一个神经网络的更新机制，输入当前网络参数，直接输出新的更新参数

5、面向RL的Meta Learning方法 
基本思路：既然Meta Learning可以用在监督学习，那么增强学习上又可以怎么做呢？能否通过增加一些外部信息的输入比如reward，和之前的action来实验。

6、通过训练一个base model的方法，能同时应用到监督学习和增强学习上 
基本思路：之前的方法只能局限在监督学习或增强学习上，能否做出一个更通用的模型。

7、利用WaveNet的方法 
基本思路：WaveNet的网络每次都利用了之前的数据，那么能否照搬WaveNet的方式来实现Meta Learning呢？就是充分利用以往的数据。

8、预测Loss的方法 
基本思路：要让学习的速度更快，除了更好的梯度，如果有更好的Loss，那么学习的速度也会更快，因此，可以构建一个模型利用以往的任务来学习如何预测Loss

### 实例讲解

- 加入记忆模块
- 借鉴LSTM
- 学习梯度
- 学习优化器
- Model-Agnostic Meta-Learning for Fast Adaption of Deep Network(MAML, from UC Berkeley):


