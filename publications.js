// 论文数据文件 - 由index.html引用
const publications = [
  {
    id: 1,
    title: "Ex Pede Herculem, Predicting Global Actionness Curve from Local Clips",
    authors: ["Xu Chen", "Yang Li", "Yahong Han", "Jialie Shen"],
    conference: "ACM International Conference on Multimedia (ACM MM)",
    year: 2025,
    coverImage: "publications_cover/mm2025.png",
    links: {
      code: "https://github.com/LannCX/FreETAD",
      paper: "https://dl.acm.org/doi/abs/10.1145/3746027.3754712"
    },
    isOral: false
  },
  {
    id: 2,
    title: "Coupling the Generator with Teacher for Effective Data-Free Knowledge Distillation",
    authors: ["Xu Chen", "Yang Li", "Yahong Han", "Guangquan Xu", "Jialie Shen"],
    conference: "International Conference on Computer Vision (ICCV)",
    year: 2025,
    coverImage: "publications_cover/iccv2025.png",
    links: {
      code: "https://github.com/LannCX/CPNet",
      paper: "https://openaccess.thecvf.com/content/ICCV2025/html/Chen_Coupling_the_Generator_with_Teacher_for_Effective_Data-Free_Knowledge_Distillation_ICCV_2025_paper.html"
    },
    isOral: false
  },
  {
    id: 3,
    title: "A Static-Dynamic Composition Framework for Efficient Action Recognition",
    authors: ["Xu Chen", "Yahong Han", "Changlin Li", "Xiaojun Chang", "Yifan Sun", "Yi Yang"],
    conference: "IEEE Transactions on Neural Networks and Learning Systems (TNNLS)",
    year: 2025,
    coverImage: "publications_cover/tnnls2025.png",
    links: {
      code: "https://github.com/LannCX/SDCOM",
      paper: "https://ieeexplore.ieee.org/abstract/document/10836808"
    },
    isOral: false
  },
  {
    id: 4,
    title: "Action Keypoint Network for Efficient Video Recognition",
    authors: ["Xu Chen", "Yahong Han", "Xiaohan Wang", "Yifan Sun", "Yi Yang"],
    conference: "IEEE Transactions on Image Processing (TIP)",
    year: 2022,
    coverImage: "publications_cover/tip2022.png",
    links: {
      paper: "https://ieeexplore.ieee.org/abstract/document/9836319"
    },
    isOral: false
  },
  {
    id: 5,
    title: "Video-to-Image Casting: A Flatting Method for Video Analysis",
    authors: ["Xu Chen", "Chenqiang Gao", "Feng Yang", "Xiaohan Wang", "Yi Yang", "Yahong Han"],
    conference: "ACM International Conference on Multimedia (ACM MM)",
    year: 2021,
    coverImage: "publications_cover/mm2021.png",
    links: {
      code: "https://github.com/LannCX/STImage",
      paper: "https://dl.acm.org/doi/abs/10.1145/3474085.3475424"
    },
    isOral: true
  },
  {
    id: 6,
    title: "Infrared Action Detection in the Dark via Cross-stream Attention Mechanism",
    authors: ["Xu Chen", "Chenqiang Gao", "Chaoyu Li", "Yi Yang", "Deyu Meng"],
    conference: "IEEE Transactions on Multimedia (TMM)",
    year: 2021,
    coverImage: "publications_cover/tmm2021.png",
    links: {
      code: "https://github.com/LannCX/InfDetNet",
      paper: "https://ieeexplore.ieee.org/abstract/document/9316950"
    },
    isOral: false
  },
  {
    id: 7,
    title: "Pose Detection in Complex Classroom Environment Based on Improved Faster R-CNN",
    authors: ["Lin Tang", "Chenqiang Gao", "Xu Chen", "Yue Zhao"],
    conference: "IET Image Processing",
    year: 2019,
    coverImage: "publications_cover/iet-ipr2019.png",
    links: {},
    isOral: false
  }
];

// 渲染论文列表的函数
function renderPublications() {
  const publicationsContainer = document.getElementById('publications-list');
  if (!publicationsContainer) return;
  
  publicationsContainer.innerHTML = '';
  
  publications.forEach(pub => {
    const li = document.createElement('li');
    li.className = 'flex items-start';
    
    // 创建论文封面
    const img = document.createElement('img');
    img.src = pub.coverImage;
    img.alt = pub.title + ' Paper Cover';
    img.className = 'aspect-video w-48 max-w-full object-cover rounded mr-4 border border-gray-200';
    
    // 创建论文信息容器
    const infoDiv = document.createElement('div');
    
    // 创建标题和作者
    const titleSpan = document.createElement('span');
    let authorsHtml = pub.authors.map(author => {
      if (author === 'Xu Chen') {
        return '<strong>' + author + '</strong>';
      }
      return author;
    }).join(', ');
    
    let conferenceHtml = pub.conference;
    if (pub.isOral) {
      conferenceHtml += ', <strong>Oral</strong>';
    }
    
    titleSpan.innerHTML = '<i class="fa fa-file-text-o text-primary mr-2 mt-1 inline-block"></i>' +
      '<strong>' + pub.title + '</strong><br>' +
      authorsHtml + '<br>' +
      conferenceHtml + ', ' + pub.year;
    
    // 创建链接容器
    const linksDiv = document.createElement('div');
    linksDiv.className = 'flex space-x-4 mt-2';
    
    // 添加代码链接
    if (pub.links.code) {
      const codeLink = document.createElement('a');
      codeLink.href = pub.links.code;
      codeLink.className = 'text-primary hover:text-primary/80 flex items-center text-sm';
      codeLink.innerHTML = '<i class="fa fa-github mr-1"></i> Code';
      codeLink.target = '_blank';
      linksDiv.appendChild(codeLink);
    }
    
    // 添加论文链接
    if (pub.links.paper) {
      const paperLink = document.createElement('a');
      paperLink.href = pub.links.paper;
      paperLink.className = 'text-primary hover:text-primary/80 flex items-center text-sm';
      paperLink.innerHTML = '<i class="fa fa-file-pdf-o mr-1"></i> Paper';
      paperLink.target = '_blank';
      linksDiv.appendChild(paperLink);
    }
    
    // 组装元素
    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(linksDiv);
    li.appendChild(img);
    li.appendChild(infoDiv);
    
    publicationsContainer.appendChild(li);
  });
}