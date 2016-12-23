srcPath=$1
projectName=$2
cp -r "$srcPath" "./$projectName"
cd $projectName
npm install seekjs