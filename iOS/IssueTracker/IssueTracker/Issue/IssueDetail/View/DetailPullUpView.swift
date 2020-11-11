//
//  DetailPullUpView.swift
//  IssueTracker
//
//  Created by 채훈기 on 2020/11/10.
//

import UIKit

class DetailPullUpView: UIView {
    
    var height: CGFloat = 120
    let temp = LabelListView()

    @IBOutlet weak var heightConstraint: NSLayoutConstraint!
    let comment = UIButton()
    
    var collectionViewHeightConstraint: NSLayoutConstraint!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        commonInit()
    }

    func commonInit() {
        
        self.backgroundColor = .systemGray3
        self.layer.cornerRadius = 20
        self.layer.shadowColor = UIColor.black.cgColor
        self.layer.shadowPath = UIBezierPath(roundedRect: self.bounds,
                                             cornerRadius: self.layer.cornerRadius).cgPath
        self.layer.shadowOffset = CGSize(width: 0.0, height: -2.0)
        self.layer.shadowOpacity = 0.2
        self.layer.shadowRadius = 5
        self.backgroundColor = .systemGray6
        let gesture = UIPanGestureRecognizer(target: self, action: #selector(updatePanGesture))
        self.addGestureRecognizer(gesture)
        
        let handleBar = UIView()
        handleBar.backgroundColor = .systemGray3
        addSubview(handleBar)
        handleBar.layer.cornerRadius = 3
        handleBar.translatesAutoresizingMaskIntoConstraints = false
        
        comment.backgroundColor = UIColor(red: 33/255, green: 74/255, blue: 122/255, alpha: 1)
        comment.setTitle("Comment", for: .normal)
        comment.tintColor = .white
        comment.setTitleColor(.systemGray3, for: .highlighted)
        comment.layer.cornerRadius = 10
        comment.titleLabel?.font = UIFont.systemFont(ofSize: 14, weight: .semibold)
        addSubview(comment)
        temp.labels = [Label(id: 1, title: "hello", color: "#3278AB"),
                       ]
        comment.addTarget(self, action: #selector(touchComment), for: .touchDown)

        addSubview(temp)
        temp.translatesAutoresizingMaskIntoConstraints = false
        comment.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            handleBar.centerXAnchor.constraint(equalTo: centerXAnchor),
            handleBar.topAnchor.constraint(equalTo: topAnchor, constant: 10),
            handleBar.widthAnchor.constraint(equalTo: widthAnchor, multiplier: 0.15),
            handleBar.heightAnchor.constraint(equalToConstant: 6),
            
            comment.topAnchor.constraint(equalTo: topAnchor, constant: 35),
            comment.heightAnchor.constraint(equalToConstant: 40),
            comment.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 30),
            comment.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -30),

            temp.topAnchor.constraint(equalTo: comment.bottomAnchor, constant: 50),
            temp.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 30),
            temp.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -30),
            temp.heightAnchor.constraint(equalToConstant: 60)
        ])
    }
    
    @objc func touchComment() {
        dragAnimation(constant: 120)
    }
    
    @objc func updatePanGesture(sender: UIPanGestureRecognizer) {
        let translation = sender.translation(in: self)
        if sender.state == .ended {
            if translation.y > 0 {
                dragAnimation(constant: 120)
            } else {
                dragAnimation(constant: UIScreen.main.bounds.height - 150)
            }
        }
        if sender.state == .changed {
            heightConstraint.constant = height - translation.y
        }
    }
    
    func dragAnimation(constant: CGFloat) {
        self.heightConstraint.constant = constant
        UIView.animate(withDuration: 0.8,
                       delay: 0,
                       usingSpringWithDamping: 0.8,
                       initialSpringVelocity: 0.8,
                       animations: {
                        self.superview?.layoutIfNeeded()
                       },completion: nil)
        height = constant
    }
}