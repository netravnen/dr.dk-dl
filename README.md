# dr.dk-dl

Tools to download .ts files:
- wget: wget -i filename.txt
- curl: cat filename.txt | xargs -n 1 curl -LO

## Merge ts files

Guides for merging telesync files:
* [Use ffmpeg copy codec to combine *.ts files into a single mp4 (windows) (superuser.com)](http://superuser.com/a/693009)

Do this on windows commandline:
1. (for %i in (*.ts) do @echo file '%i') > mylist.txt
2. You _will_ want to check out your mylist.txt file is sorted in the correct order. As the telesync files be concatted in the order (top-down) listed in mylist.txt.
3. ffmpeg -f concat -i mylist.txt -c copy output.ts
