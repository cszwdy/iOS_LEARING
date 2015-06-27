//
//  ViewController.swift
//  customAlert
//
//  Created by Emiaostein on 6/25/15.
//  Copyright (c) 2015 botai. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    var de: OverlaytransitioningDelegate?

    override func viewDidLoad() { 
        super.viewDidLoad()
    }

    
    func showOverlay() {
        
        let overlay = OverlayViewController()
        de = OverlaytransitioningDelegate()
        overlay.transitioningDelegate = de!
        presentViewController(overlay, animated: true, completion: nil)
    }

    @IBAction func buttonAction(sender: UIButton) {
        
        showOverlay()
    }
    @IBOutlet weak var buttonAction: UIButton!
}

