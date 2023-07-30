import numpy as np
from PIL import Image
from matplotlib.figure import Figure
import skimage.transform as st
from skimage.io import imread
from sklearn.utils import shuffle
from sklearn.cluster import KMeans
import base64
import io
import urllib.request

def generate_palette(img_path):

    #in case it's a gif
    if (img_path[-3:] == 'gif'):
        urllib.request.urlretrieve(img_path, "path")
        with Image.open("path") as im:
            im.seek(0)
            arr = np.array(im.convert('RGB'), dtype=np.float64) / 255           
    else:
        #convert img to np array
        arr = np.array(imread(img_path)[...,:3], dtype=np.float64) / 255

    arr = st.resize(arr, (arr.shape[0]//3, arr.shape[1]//3), anti_aliasing=True)

    w, h, d  = tuple(arr.shape)
    data = np.reshape(arr, (w * h, d))

    ##CLUSTER IN RGB
    x = data[...,0].ravel()
    y = data[...,1].ravel()
    z = data[...,2].ravel()

    concat = np.vstack((x,y,z)).T
    subset = shuffle(concat)
    
    #kmeans clustering
    kmeans = KMeans(n_clusters=6)
    kmeans.fit(subset)
    centroids = kmeans.cluster_centers_
    
    #for web
    fig = Figure(figsize=(8, 2))
    axes = fig.add_subplot(1, 1, 1)

    axes.imshow(centroids.reshape(1,len(centroids),3), interpolation='nearest')
    axes.xaxis.set_visible(False)
    axes.yaxis.set_visible(False)
    
    buffer = io.BytesIO()
    fig.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)

    encoded_image = base64.b64encode(buffer.getbuffer()).decode('ascii')
    return encoded_image