---
layout: post
title: Single Shot Temproal Action Detection
categories: Papers
description: An ACMM2017 paper
keywords: Action Detection
---

This time I'll share you a paper named [Single Shot Temproal Action Detection](https://arxiv.org/abs/1710.06236), which proposed to detect action instances in untrimmed videos. Their method, called SSAD, performed 24.6% and 11.0% mAP (mean average precision) on [THUMOS 2014](http://crcv.ucf.edu/THUMOS14/) and [MEXaction2](http://mexculture.cnam.fr/xwiki/bin/view/Datasets/Mex+action+dataset), respectively (IOU=0.5). Most importantly, this is the first network  which can effectively predict both the boundaries and confidence scores of multiple action categories in untrimmed videos without proposal generation step.

## Introduction
Compare with action recognition, action detection models need to process the untrimmed videos with multiple action instances, and predict the start time, end time and categories of each action instance. Action detection is similar to the object detection in 2D image, both of them aim to find the boundaries and confidence scores of instances. 

![Object Detection and Action Detection](/images/posts/SSAD/OTAT.png)

Current state-of-the-art methods are inspired by two-stage Faster-RCNN [^1] framework: first generate proposals, and then classify the features extracted by proposals (Like R-C3D[^2]). As we know, one-stage object detectors is more time effective and straightforward, like SSD[^3] and YOLO[^4]. So, this paper try to apply one-stage framwork from object detection to action detection.

![Two-Stage Object Detection framwork](/images/posts/SSAD/two-stage.png)

## Framwork

![SSAD Framwork](/images/posts/SSAD/framwork.png)

Block diagram above show a brief framwork of their work. First, extrct features from clipped video window to generate a 2D feature map, which called snippet-level action score. Then go through the single shot action detector network composed by 1D convolution layers. Okay, let's discuss the details about it.

## Method
### Feature extraction

![Feature extraction](/images/posts/SSAD/feature.png)

The input, called snippet, composed of single image $x_{t}$, optical flow $F_{t}$, and image sequence $X_{t}$. For $x_{t}$ and $F_{t}=\left \{ f_{t^{'}}\right \}_{t^{'}=t-4}^{t=t+5}$, as the input of the two-stream network[^5] which have spatial and temporal branches. The $X_{t}$ is processed by C3D[^6] network. For each image at $t$ in video sequence window, the author use three individual network to extract spatial featue, optical flow feature, temporal feature from the ==softmax== layer. And then concatenate them as a feature vector $p_{sas},t$. In the end, we get a 2D feature map called SAS feature.

### SSAD model

![SSAD structure](/images/posts/SSAD/SSAD.png)

This model contains three main component: Base Layer, Anchor Layers, and Prediction Layer.
- Base layers: 作用为缩短特征序列的长度，并增大特征序列中每个位置的感受野。

## Experiments

## Thinkings





[^1]: Faster R-CN
[^2]: R-C3D
[^3]: SSD
[^4]: YOLO
[^5]: two-stream network
[^6]: C3D