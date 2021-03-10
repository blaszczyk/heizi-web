import os
import hashlib
import sys
import re
import time
import subprocess
from shutil import copyfile
from deployconfig import sshtarget

hashextensions = ['.css', '.js']

def md5digest(filename):
	with open(filename, 'rb') as file:
		return hashlib.md5(file.read()).hexdigest()

distdir = 'dist/%d' % int(time.time())
os.makedirs(distdir)

hashes = {}
htmlfiles = []

for root, subFolders, files in os.walk('src'):
	for file in files:
		srcpath = root + '/' + file
		relpath = srcpath[4:]
		extension = file[file.rindex('.'):]
		if extension == '.html':
			htmlfiles.append(relpath)
		elif extension in hashextensions:
			hash = md5digest(srcpath)
			di = relpath.rindex('.')
			hashpath = relpath[:di] + '-' + hash + relpath[di:]
			hashes[relpath] = hashpath
			distpath = distdir + '/' + hashpath
			print('copy', relpath, distpath)
			copyfile(srcpath, distpath)
		else:
			distpath = distdir + '/' + relpath
			print('copy', relpath, distpath)
			copyfile(srcpath, distpath)

for htmlfile in htmlfiles:
	print('copy and adapt', htmlfile)
	distlines = []
	with open('src/' + htmlfile, 'r') as srcfile:
		for line in srcfile.readlines():
			hashline = line
			for srcpath, distpath in hashes.items():
				regex = re.compile('(?<=(src|ref)\\=")' + re.escape(srcpath) + '(?=")')
				hashline = re.sub(regex, distpath, hashline)
			distlines.append(hashline)
	with open(distdir + '/' + htmlfile, 'w') as distfile:
		distfile.writelines(distlines)

print('deploying to', sshtarget)
subprocess.run(['scp', '-r', distdir + '/*', sshtarget])
