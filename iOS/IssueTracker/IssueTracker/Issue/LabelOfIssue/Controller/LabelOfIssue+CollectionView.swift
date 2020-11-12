//
//  LabelOfIssue+CollectionView.swift
//  IssueTracker
//
//  Created by 채훈기 on 2020/11/12.
//

import UIKit

extension LabelOfIssueCreateViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return filteredLabel.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    
        guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "Cell", for: indexPath) as? LabelAddCollectionViewCell else { return UICollectionViewCell() }
        cell.configure(label: filteredLabel[indexPath.row])
        return cell
    }
}

extension LabelOfIssueCreateViewController: UICollectionViewDelegate {
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        IssueManager().appendLabelOfIssue(issueId: issue.id, labelId: filteredLabel[indexPath.row].id, completion: nil)
    }
}

extension LabelOfIssueCreateViewController: UICollectionViewDelegateFlowLayout {
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: collectionView.frame.width * 0.8, height: 60)
    }
}