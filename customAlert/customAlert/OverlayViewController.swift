//
//  OverlayViewController.swift
//  
//
//  Created by Emiaostein on 6/25/15.
//
//

import UIKit

class OverlayViewController: UIViewController {
    
    init() {
        super.init(nibName: nil, bundle: nil)
        modalPresentationStyle = .Custom
        view.backgroundColor = UIColor.blackColor()
        
        let tap = UITapGestureRecognizer(target: self, action: "tap:")
        view.addGestureRecognizer(tap)
    }

    required init(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

    }
    
    func tap(sender: UITapGestureRecognizer) {
        
        dismissViewControllerAnimated(true, completion: nil)
    }
    
    

}
