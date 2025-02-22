# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This software may be used and distributed according to the terms of the
# GNU General Public License found in the LICENSE file in the root
# directory of this source tree.

# This test represents the scenario in https://internalfb.com/excalidraw/EX180556
  $ . "${TEST_FIXTURES}/library.sh"
  $ REPOTYPE="blob_files"
  $ ENABLED_DERIVED_DATA='["git_commits", "git_trees", "git_delta_manifests", "unodes", "filenodes", "hgchangesets"]' setup_common_config $REPOTYPE
  $ GIT_REPO_ORIGIN="${TESTTMP}/origin/repo-git"
  $ GIT_REPO="${TESTTMP}/repo-git"
  $ HG_REPO="${TESTTMP}/repo-hg"
  $ BUNDLE_PATH="${TESTTMP}/repo_bundle.bundle"
  $ cat >> repos/repo/server.toml <<EOF
  > [source_control_service]
  > permit_writes = true
  > EOF

# Setup git repository
  $ mkdir -p "$GIT_REPO_ORIGIN"
  $ cd "$GIT_REPO_ORIGIN"
  $ git init -q
  $ echo "this is fileA" > fileA
  $ git add fileA
  $ git commit -qam "Add fileA"
  $ git tag -a -m"new tag" first_tag
  $ echo "this is fileA.1" > fileA
  $ echo "this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB" > fileB
  $ git add .
  $ git commit -qam "Modified fileA -> fileA.1, Add fileB"
  $ git tag -a empty_tag -m ""
  $ cd "$TESTTMP"
  $ git clone "$GIT_REPO_ORIGIN"
  Cloning into 'repo-git'...
  done.

# Capture all the known Git objects from the repo
  $ cd $GIT_REPO
  $ git rev-list --objects --all | git cat-file --batch-check='%(objectname) %(objecttype) %(rest)' | sort > $TESTTMP/object_list

# Import it into Mononoke
  $ cd "$TESTTMP"
  $ gitimport --record-head-symref "$GIT_REPO" --derive-hg --generate-bookmarks full-repo &> /dev/null

# Start up the Mononoke Git Service
  $ mononoke_git_service
# Clone the Git repo from Mononoke
  $ git_client clone $MONONOKE_GIT_SERVICE_BASE_URL/$REPONAME.git
  Cloning into 'repo'...
# Verify that we get the same Git repo back that we started with
  $ cd $REPONAME  
  $ git rev-list --objects --all | git cat-file --batch-check='%(objectname) %(objecttype) %(rest)' | sort > $TESTTMP/new_object_list
  $ diff -w $TESTTMP/new_object_list $TESTTMP/object_list

# Add more commits to the original git repo. Make sure the files added/modified in this commit
# create a cycle of deltas
  $ cd $GIT_REPO_ORIGIN
  $ echo "this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.1.this is fileB.1" > fileB
  $ git add fileB
  $ git commit -qam "Modified fileB -> fileB.1"
  $ echo "this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB.this is fileB" > fileB
  $ git add fileB
  $ git commit -qam "Reverted fileB.1 -> fileB"
  $ git tag -a -m "last tag" last_tag

  $ cd "$GIT_REPO"
  $ git pull "$GIT_REPO_ORIGIN" &> /dev/null
# Capture all the known Git objects from the repo
  $ git rev-list --objects --all | git cat-file --batch-check='%(objectname) %(objecttype) %(rest)' | sort > $TESTTMP/object_list

# Import the newly added commits to Mononoke
  $ cd "$TESTTMP"
  $ gitimport --record-head-symref "$GIT_REPO_ORIGIN" --derive-hg --generate-bookmarks full-repo &> /dev/null
# Pull the Git repo from Mononoke
  $ cd $REPONAME
  $ git_client pull $MONONOKE_GIT_SERVICE_BASE_URL/$REPONAME.git &> /dev/null
# Verify that we get the same Git repo back that we started with
  $ git rev-list --objects --all | git cat-file --batch-check='%(objectname) %(objecttype) %(rest)' | sort > $TESTTMP/new_object_list
  $ diff -w $TESTTMP/new_object_list $TESTTMP/object_list
