#coding=utf-8

import jieba # 引入jieba库
from os import path # 引入os库中的path模块
from wordcloud import WordCloud # 引入wordcloud词云图
import matplotlib # 引入matplotlib库
matplotlib.use('TKAgg')
import matplotlib.pyplot as plt # 引入matplotlib库中的pyplot模块
import sys
text = sys.argv[1]
words = jieba.cut(text) # 使用jieba库对文本进行分词
wordStr = ''.join(words) # 将分词结果转化为字符串 .strip()去除字符串两端的空格
print(type(wordStr))
# 添加字体文件 随便找一个字体文件就行 不然不支持中文
font_path = path.join(path.dirname(__file__), 'font/font.ttf')
if not path.exists(font_path):
    print("Font file {font_path} does not exist.")
    sys.exit(1)

wc = WordCloud(font_path=font_path,
        width=1000,
        height=800,
        max_words=200000,
        background_color='white'
    ) # 创建词云对象
if not isinstance(wordStr, str):
    raise ValueError("wordStr must be a string, not {}".format(type(wordStr)))

wc.generate(wordStr) # 生成词云图

output_path = path.join(path.dirname(__file__), 'img/wine.png')
wc.to_file(output_path) # 保存词云图png格式
print("Word cloud saved to {output_path}")

# 输出词云图
plt.figure()
# 显示图像 interpolation='bilinear' 表示插值方法为双线性插值
plt.imshow(wc, interpolation='bilinear')
# 关掉图像的坐标
plt.axis('off')
# plt.savefig('./img/test.png')
plt.show()
